import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import api from '../../../salesforce'; // Secure Salesforce API instance
import { toast } from "react-toastify";
import BASE_URL from "../../Confi/baseurl"
import logo from "../../assets/piramal_bg.png";
import ComLogo from "../../assets/ComLogo.png";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [OtpSection, setOtpSection] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedContent, setSelectedContent] = useState("content1");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleContent = (content) => {
    setSelectedContent(content);
    setError("");
  };

  const regiterPage = () => {
    navigate("/register");
  };

  // handlePasswordLogin removed, only OTP login is used

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    const soqlQuery = `SELECT Id, Name, Loyalty_Balance__c, Opportunity__c, Loyalty_Member_Unique_Id__c, Phone_Mobile_Number__c, Total_Points_Credited__c, Total_Points_Debited__c, Total_Points_Expired__c, Active__c FROM Loyalty_Member__c WHERE Phone_Mobile_Number__c = '${mobile}'`;
    const encodedQuery = encodeURIComponent(soqlQuery);
    const url = `/services/data/v64.0/query/?q=${encodedQuery}`;

    let response;
    try {
      response = await api.get(url);
    } catch (err) {
      // If 401, try to refresh token and retry
      if (err.response && err.response.status === 401) {
        try {
          // Manually call token API
          const params = new URLSearchParams();
          params.append('grant_type', 'password');
          params.append('client_id', import.meta.env.VITE_SF_CLIENT_ID);
          params.append('client_secret', import.meta.env.VITE_SF_CLIENT_SECRET);
          params.append('username', import.meta.env.VITE_SF_USERNAME);
          params.append('password', import.meta.env.VITE_SF_PASSWORD);
          const tokenResponse = await fetch(import.meta.env.VITE_SF_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
          });
          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            localStorage.setItem('salesforce_access_token', tokenData.access_token);
            // Retry original request with new token
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
      if (response && response.status === 200 && response.data && response.data.records && response.data.records.length > 0) {
        const record = response.data.records[0];
        const loyaltyId = record.Loyalty_Member_Unique_Id__c;
        if (loyaltyId) {
          localStorage.setItem("Id", record.Id);
          localStorage.setItem("Loyalty_Member_Unique_Id__c", loyaltyId);
          localStorage.setItem("Opportunity__c", record.Opportunity__c);
          const numericLoyaltyId = parseInt(loyaltyId, 10);
          navigate(`/dashboard/transactions/${numericLoyaltyId}`);
          toast.success("Login successful!");
        } else {
          toast.error("Could not find customer identifier. Please contact support.");
        }
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMobileInput = () => {
    setShowOtpSection(false);   // hide OTP input section
    setOtpSection(true);        // show mobile input section
    setOtp("");                 // clear OTP input
    setError("");               // (optional) clear error
  };
  
  const renderOtpLogin = () => (
    <form onSubmit={handleSendOtp} className="mt-3 w-full max-w-[380px]">
  
      {/* Mobile Number Input */}
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
            LOGIN
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

              <div className=" p-6 sm:p-8 md:p-12 mx-auto flex flex-col ">
                <img
                  className="w-[200px] h-[120px] xs:w-[120px] xs:h-[80px] sm:w-[160px] sm:h-[100px] md:w-[200px] md:h-[120px] lg:w-[320px] lg:h-[180px] xl:w-[200px] xl:h-[150px] mx-auto object-contain"
                  src={ComLogo}
                  alt="Logo"
                />


                <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center w-full mt-4 px-0 sm:px-4">
                  <div className="form-group">
                    {/* <div className="form-check flex items-center">
                      <input
                        className="w-5 h-5 rounded-full border-2 border-white appearance-none checked:border-white checked:before:w-2 checked:before:h-2 checked:before:bg-[#de7008] checked:before:rounded-full checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:transform checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 relative mr-2"
                        type="radio"
                        name="contentSelector"
                        value="content1"
                        checked={selectedContent === "content1"}
                        onChange={() => toggleContent("content1")}
                      />
                      <label className="text-white cursor-pointer text-sm sm:text-base">
                        Login with password
                      </label>
                    </div> */}
                  </div>
                  <div className="form-group flex items-center justify-center h-full">
                    <div className="form-check flex items-center">
                      {
                        /* <input
                        className="w-5 h-5 rounded-full border-2 border-white appearance-none relative mr-2"
                        // type="radio"
                        name="contentSelector"
                        value="content2"
                        // checked={selectedContent === "content2"}
                        // onChange={() => toggleContent("content2")}
                      />
                      <label className="text-white cursor-pointer text-sm sm:text-base">
                        Login with OTP
                      </label> */
                      }
                      <h3 className="text-center font-[500] text-white text-lg">Login With OTP</h3>
                    </div>
                  </div>

                </div>
                <div className="flex justify-center w-full">
                  {/* {selectedContent === "content1" && renderPasswordLogin()} */}
                  {/* {selectedContent === "content2" && renderOtpLogin()} */}
                  {renderOtpLogin()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;