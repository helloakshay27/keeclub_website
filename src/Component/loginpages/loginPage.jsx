import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/piramal_bg.png";
import ComLogo from "../../assets/ComLogo.png";
import { getAccessToken } from "../../api/auth";
import BASE_URL from "../../Confi/baseurl";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // ✅ On page load → fetch Salesforce access token
//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append("grant_type", "refresh_token");
//         params.append("client_id", import.meta.env.VITE_CLIENT_ID);
//         params.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
//         params.append("refresh_token", import.meta.env.VITE_REFRESH_TOKEN);

//         // 👇 Use Vite proxy path
//         const tokenResponse = await fetch(
//           "/salesforce/services/oauth2/token",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             body: params,
//           }
//         );

//         const tokenData = await tokenResponse.json();
//         console.log("🔑 Token response:", tokenData);

//         if (tokenData.access_token) {
//           localStorage.setItem("salesforce_access_token", tokenData.access_token);
//           localStorage.setItem("salesforce_instance_url", tokenData.instance_url);
//         } else {
//           toast.error("Failed to get Salesforce token.");
//         }
//       } catch (err) {
//         console.error("Token fetch error:", err);
//         toast.error("Could not connect to Salesforce.");
//       }
//     };

//     fetchToken();
//   }, []);

  // Step 1: Handle mobile submit, generate OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Validate mobile with Salesforce REST API
      let accessToken = localStorage.getItem("salesforce_access_token");
      let instanceUrl = localStorage.getItem("salesforce_instance_url");

      if (!accessToken || !instanceUrl) {
        const tokenData = await getAccessToken();
        if (!tokenData?.access_token || !tokenData?.instance_url) {
          toast.error("Unable to authenticate with Salesforce.");
          setLoading(false);
          return;
        }
        accessToken = tokenData.access_token;
        instanceUrl = tokenData.instance_url;
        localStorage.setItem("salesforce_access_token", accessToken);
        localStorage.setItem("salesforce_instance_url", instanceUrl);
      }

      const validationUrl = `${instanceUrl}/services/apexrest/getValidation?ValidationCred=${mobile}&ValidationType=Mobile`;
      const validationResponse = await axios.get(validationUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const validationRecords = validationResponse.data?.records || [];
      if (validationRecords.length === 0) {
        toast.error("Mobile number not found.");
        setLoading(false);
        return;
      }

      // Generate OTP
      const otpGenUrl = `${BASE_URL}get_otps/generate_otp?mobile=${mobile}`;
      await axios.get(otpGenUrl);

      setShowOtpInput(true);
      toast.success("OTP sent to your mobile.");
    } catch (err) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP verification and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error("Please enter the OTP sent to your mobile.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify OTP
      const otpVerifyUrl = `${BASE_URL}get_otps/verify_otp.json?mobile=${mobile}&otp=${otp}`;
      const otpVerifyResponse = await axios.get(otpVerifyUrl);
      if (!otpVerifyResponse.data?.otp_valid) {
        toast.error("OTP verification failed.");
        setLoading(false);
        return;
      }

      // Proceed with Salesforce login logic (SOQL query)
      let accessToken = localStorage.getItem("salesforce_access_token");
      let instanceUrl = localStorage.getItem("salesforce_instance_url");

      if (!accessToken || !instanceUrl) {
        const tokenData = await getAccessToken();
        if (!tokenData?.access_token || !tokenData?.instance_url) {
          toast.error("Unable to authenticate with Salesforce.");
          setLoading(false);
          return;
        }
        accessToken = tokenData.access_token;
        instanceUrl = tokenData.instance_url;
        localStorage.setItem("salesforce_access_token", accessToken);
        localStorage.setItem("salesforce_instance_url", instanceUrl);
      }

      const validationUrl = `${instanceUrl}/services/apexrest/getValidation?ValidationCred=${mobile}&ValidationType=Mobile`;
      const validationResponse = await axios.get(validationUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const validationRecords = validationResponse.data?.records || [];

      const soqlQuery = `
        SELECT Id, Name, Loyalty_Balance__c, Opportunity__c, 
               Loyalty_Member_Unique_Id__c, Phone_Mobile_Number__c, 
               Total_Points_Credited__c, Total_Points_Debited__c, 
               Total_Points_Expired__c, Active__c
        FROM Loyalty_Member__c 
        WHERE Phone_Mobile_Number__c IN ('${mobile}', '+91${mobile}')
      `;
      const encodedQuery = encodeURIComponent(soqlQuery.trim());
      const url = `${instanceUrl}/services/data/v64.0/query/?q=${encodedQuery}`;

      let response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let records = Array.isArray(response.data.records)
        ? response.data.records
        : [];

      // If no record found, create a new Loyalty Member and re-query
      if (records.length === 0 && validationRecords.length > 0) {
        // Extract names from Full_Name__c
        const fullName = validationRecords[0].Full_Name__c || "";
        let firstName = "";
        let lastName = "";
        if (fullName) {
          const nameParts = fullName.replace(/^Mr\.|^Ms\.|^Mrs\./i, "").trim().split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(" ") || "";
        }
        if (!firstName) firstName = "User";
        if (!lastName) lastName = " ";

        const opportunityId = validationRecords[0].Opportunity_Name__c || "";

        const createMemberBody = {
          Phone_Mobile_Number__c: mobile,
          First_Name__c: firstName,
          Last_Name__c: lastName,
          Opportunity__c: opportunityId,
          Active__c: true,
        };

        const createMemberUrl = `${instanceUrl}/services/data/v64.0/sobjects/Loyalty_Member__c/`;
        await axios.post(createMemberUrl, createMemberBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // Re-run the SOQL query to get the new member
        response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        records = Array.isArray(response.data.records)
          ? response.data.records
          : [];
      }

      if (records.length > 0) {
        const record = records[0];
        var loyaltyId = record.Loyalty_Member_Unique_Id__c?.replace(/^0+/, '');

        if (loyaltyId) {
          localStorage.setItem("Id", record.Id);
          localStorage.setItem("Loyalty_Member_Unique_Id__c", record.Loyalty_Member_Unique_Id__c);
          localStorage.setItem("Opportunity__c", record.Opportunity__c);
          localStorage.setItem("salesforce_mobile", record.Phone_Mobile_Number__c || mobile);
          localStorage.setItem("Loyalty_Balance__c", record.Loyalty_Balance__c || 0);
          localStorage.setItem("Total_Points_Credited__c", record.Total_Points_Credited__c || 0);
          localStorage.setItem("Total_Points_Debited__c", record.Total_Points_Debited__c || 0);
          localStorage.setItem("Total_Points_Expired__c", record.Total_Points_Expired__c || 0);

          navigate(`/dashboard/transactions/${loyaltyId}`);
          toast.success("Login successful!");
        } else {
          toast.error("Could not find customer identifier. Please contact support.");
        }
      } else {
        toast.error("No record found for this mobile number (with or without +91).");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.[0]?.message ||
        "An error occurred while querying Salesforce."
      );
    } finally {
      setLoading(false);
    }
  };

  // UI for mobile and OTP entry
  const renderOtpLogin = () => (
    <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="mt-3 w-full max-w-[380px]">
      <div className="form-group relative mb-4">
        <label className="mb-1 block text-white mt-4" htmlFor="mobile">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
          placeholder="Enter registered mobile number..."
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          disabled={showOtpInput}
        />
        {showOtpInput && (
          <>
            <label className="mb-1 block text-white mt-4" htmlFor="otp">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
          disabled={loading}
        >
          {loading ? "Loading..." : showOtpInput ? "VERIFY OTP" : "LOGIN"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );

  return (
    <main className="h-full w-full overflow-hidden">
      <section>
        <div className="container-fluid h-full">
          <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${logo})` }}
          >
            <div className="w-full max-w-lg mx-auto px-4 ">
              <div className="p-6 sm:p-8 md:p-12 mx-auto flex flex-col ">
                <img
                  className="w-[200px] h-[120px] xs:w-[120px] xs:h-[80px] sm:w-[160px] sm:h-[100px] md:w-[200px] md:h-[120px] lg:w-[320px] lg:h-[180px] xl:w-[200px] xl:h-[150px] mx-auto object-contain"
                  src={ComLogo}
                  alt="Logo"
                />
                <div className="flex justify-center w-full">{renderOtpLogin()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
