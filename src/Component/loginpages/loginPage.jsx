import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../salesforce"; // Secure Salesforce API instance
import { toast } from "react-toastify";
import logo from "../../assets/piramal_bg.png";
import ComLogo from "../../assets/ComLogo.png";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [OtpSection, setOtpSection] = useState(true);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = `/your/salesforce/api/endpoint?mobile=${mobile}`; // Replace with your actual endpoint
    let response;
    try {
      // Always use the latest token from localStorage
      const token = localStorage.getItem('salesforce_access_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      response = await api.get(url);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          const params = new URLSearchParams();
          params.append('grant_type', 'refresh_token');
          params.append('client_id', import.meta.env.VITE_SF_CLIENT_ID);
          params.append('client_secret', import.meta.env.VITE_SF_CLIENT_SECRET);
          params.append('refresh_token', import.meta.env.VITE_SF_REFRESH_TOKEN);
          const tokenResponse = await fetch(import.meta.env.VITE_SF_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
          });
          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            localStorage.setItem('salesforce_access_token', tokenData.access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`;
            response = await api.get(url);
          } else {
            toast.error("Could not refresh token. Please try again later.");
            setLoading(false);
            return;
          }
        } catch (tokenErr) {
          toast.error("Token refresh failed. Please try again later.");
          setLoading(false);
          return;
        }
      } else {
        toast.error(err.response?.data?.[0]?.message || "An error occurred during login.");
        setLoading(false);
        return;
      }
    }

    try {
      if (response && response.status === 200) {
        console.log("Salesforce response:", response.data); // 🔎 Debug

        const records = Array.isArray(response.data.records)
          ? response.data.records
          : [];

        if (records.length > 0) {
          const record = records[0];
          const loyaltyId = record.Loyalty_Member_Unique_Id__c;

          if (loyaltyId) {
            localStorage.setItem("Id", record.Id);
            localStorage.setItem("Loyalty_Member_Unique_Id__c", loyaltyId);
            localStorage.setItem("Opportunity__c", record.Opportunity__c);

            const numericLoyaltyId = parseInt(loyaltyId, 10);
            navigate(`/dashboard/transactions/${numericLoyaltyId}`);
            toast.success("Login successful!");
          } else {
            toast.error(
              "Could not find customer identifier. Please contact support."
            );
          }
        } else {
          toast.error(
            "No record found for this mobile number. Please verify how the number is stored in Salesforce (maybe with country code)."
          );
        }
      } else if (response) {
        toast.error(`Unexpected response: ${response.status}`);
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMobileInput = () => {
    setShowOtpSection(false);
    setOtpSection(true);
    setError("");
  };

  const renderOtpLogin = () => (
    <form onSubmit={handleSendOtp} className="mt-3 w-full max-w-[380px]">
      {OtpSection && !showOtpSection && (
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
          />
          <button
            type="submit"
            className="w-full cursor-pointer h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
            disabled={loading}
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </div>
      )}

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

                <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center w-full mt-4 px-0 sm:px-4">
                  <div className="form-group flex items-center justify-center h-full">
                    <div className="form-check flex items-center">
                      <h3 className="text-center font-[500] text-white text-lg">
                        Login With OTP
                      </h3>
                    </div>
                  </div>
                </div>
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
