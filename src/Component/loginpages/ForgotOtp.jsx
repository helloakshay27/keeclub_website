import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/lockated-logo.png";


const ForgotOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const mobile = queryParams.get("mobile");

  const navigate = useNavigate();

  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: logo,
    loginBgClass: "bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')]",
    showRegisterButton: true,
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    navigate(
      `/reset-password?email=${encodeURIComponent(
        email
      )}&mobile=${encodeURIComponent(mobile)}`
    );

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.baseURL}verify-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/forgot-password");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div>
      <main className="h-full w-full overflow-hidden">
        <section className="">
          <div className="container-fluid h-full">
            <div className={`row items-center h-full bg-cover bg-center bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')] justify-center`}>
              <div className="col-lg-7 col-md-7 h-screen flex items-center">
                <div 
                  className="border border-[rgba(58,58,51,0.4)] shadow-[0px_3px_8px_0px_rgba(217,217,217,0.08)] p-[3%_7%] mx-auto flex flex-col backdrop-blur bg-[#291b117f]"
                  id="forgetPasswordContainer"
                >
                  <img
                    className="w-[120px] h-[120px] md:w-[220px] md:h-[70px] mx-auto"
                    src={config.logoUrl}
                    alt="Logo"
                  />
                  <form
                    className="mt-3 w-full max-w-[380px]"
                    id="otpForm"
                    onSubmit={handleOtpSubmit}
                  >
                    <div className="flex justify-between items-baseline mb-0 md:mb-4">
                      {/* Back button and pagination can be added here if needed */}
                    </div>
                    <h5 className="text-white text-xl mb-3 mt-6">Enter OTP</h5>
                    <p className="text-white mb-6">
                      We've sent a 5-digit OTP to your mobile number.{" "}
                      <span className="text-[#de7008]">{email}</span>
                      Enter it below to continue.
                    </p>
                    
                    <div className="mb-4 relative">
                      <label className="block text-white mb-2" htmlFor="otp">
                        OTP
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        id="otp"
                        placeholder="Enter 5-digit OTP..."
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength={6}
                      />
                    </div>
                    
                    {error && <p className="text-red-500">{error}</p>}
                    
                    <button
                      type="submit"
                      className="w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] ml-11"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "VERIFY OTP"}
                    </button>

                    <div className="text-center mt-4">
                      <p className="text-gray-300 mb-0">
                        Resend code in{" "}
                        <span className="text-white font-medium">
                          {formatTime(countdown)}
                        </span>
                      </p>
                    </div>

                    <div className="text-center mt-5">
                      <p className="text-gray-300 mb-0">
                        Entered wrong email id?
                        <button
                          type="button"
                          onClick={goBack}
                          className="ml-1 font-bold text-white hover:text-[#de7008] transition-colors duration-300"
                        >
                          GO BACK
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotOtp;