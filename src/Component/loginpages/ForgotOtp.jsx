import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

  // Mock functions for demo
  const toast = {
    error: (message) => console.log(`Error: ${message}`),
    success: (message) => console.log(`Success: ${message}`)
  };

  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: logo,
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!/^[0-9]{5,6}$/.test(otp)) {
      setError("Please enter a valid 5-6 digit OTP.");
      setLoading(false);
      return;
    }

    try {
      // Mock API call
      toast.success("OTP verified successfully");
      navigate(
        `/reset-password?email=${encodeURIComponent(
          email
        )}&mobile=${encodeURIComponent(mobile)}`
      );
    } catch (err) {
      setError("An error occurred while verifying OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.");
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

  const handleResendOtp = () => {
    setCountdown(45);
    toast.success("OTP resent successfully");
  };

  return (
    <div className="font-open-sans">
      <main className="h-full w-full overflow-hidden">
        <section className="">
          <div className="container-fluid h-full">
            <div className={`min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')]`}>
              <div className="w-full max-w-lg mx-auto px-4 py-8">
                <div
                  className="border border-[rgba(58,58,51,0.4)] shadow-[0px_3px_8px_0px_rgba(217,217,217,0.08)] p-6 sm:p-8 md:p-12 mx-auto flex flex-col backdrop-blur bg-[#291b117f]"
                  id="forgetPasswordContainer"
                >
                  <img
                    className="w-[100px] h-[100px] xs:w-[120px] xs:h-[120px] sm:w-[160px] sm:h-[50px] md:w-[200px] md:h-[60px] lg:w-[220px] lg:h-[70px] mx-auto object-contain"
                    src={config.logoUrl}
                    alt="Logo"
                  />

                  <div className="mt-2 w-full max-w-[380px] mx-auto">
                    <form
                      id="otpForm"
                      onSubmit={handleOtpSubmit}
                    >
                      <h5 className="text-white text-xl mb-3 mt-6">Enter OTP</h5>
                      <p className="text-white mb-6">
                        We've sent a 5-digit OTP to your email.{" "}
                        <span className="text-[#de7008]">{email}</span>{" "}
                        Enter it below to continue.
                      </p>
                      
                      <div className="form-group relative mb-4">
                        <label className="mb-1 block text-white" htmlFor="otp">
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
                      
                      {error && (
                        <div className="text-red-500 mt-3 font-medium">{error}</div>
                      )}
                      
                      <button
                        type="submit"
                        className="w-full sm:w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
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
                        {countdown === 0 && (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-[#de7008] hover:text-white font-bold mt-2"
                          >
                            RESEND OTP
                          </button>
                        )}
                      </div>

                      <div className="text-center mt-5">
                        <p className="text-gray-300 mb-0">
                          Entered wrong email id?{" "}
                          <button
                            type="button"
                            onClick={goBack}
                            className="font-bold text-white hover:text-[#de7008] transition-colors"
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotOtp;