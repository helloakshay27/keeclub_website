import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/piramal_bg.png";
import { useNavigate } from "react-router-dom";
import ComLogo from "../../assets/ComLogo.png";
import logo_bg from "../../assets/bg_light.png";
import logo_main from "../../assets/logo.png";
import axios from "axios";





const SignIn = () => {
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState("content1");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [OtpSection, setOtpSection] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  // Mock functions for demo
  const toast = {
    error: (message) => console.log(`Error: ${message}`),
    success: (message) => console.log(`Success: ${message}`)
  };


  // Configuration
  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: logo,
    showRegisterButton: true,
  };

  const toggleContent = (content) => {
    setSelectedContent(content);
    setError("");
  };

  const regiterPage = () => {
    navigate("/Register");
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://piramal-loyalty-dev.lockated.com/api/users/sign_in`,
        null, // No body
        {
          params: {
            email,
            password
          }
        }
      );

      const data = response.data;

      if (data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        toast.success("Login successful!");
        navigate(`/dashboard/transactions/${data.id}`);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }

    setLoading(false);
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      setOtpSection(false);
      toast.success("OTP Sent successfully");
      setShowOtpSection(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred to Send OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter a valid OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      toast.success("Login successfully");
      navigate("/project-list");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordLogin = () => {
    return (
      <div className="mt-2 w-full max-w-[380px]">


        <div className="form-group relative mb-2">
          <label className="mb-1 block text-white" htmlFor="email">
            Email ID
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
            placeholder="Enter email id here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group relative mb-4">
          <label className="mb-1 block text-white" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
              placeholder="Enter password here..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent border-none p-0 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={18} className="text-[#de7008]" />
              ) : (
                <Eye size={18} className="text-[#de7008]" />
              )}
            </button>
          </div>
        </div>


        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handlePasswordLogin}
          type="submit"
          className="w-full  h-11 cursor-pointer bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>


      </div>
    );
  };

  const renderOtpLogin = () => (
    <form onSubmit={handleVerifyOtp} className="mt-3 w-full max-w-[380px]">
      {OtpSection && (
        <div className="form-group relative mb-4">
          <label className="mb-1 block text-white mt-4" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none "
            placeholder="Enter registered mobile number..."
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <button
            type="button"
            className="w-full  h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block mt-4"
            onClick={handleSendOtp}
            disabled={loading}
          >
            SEND OTP
          </button>
        </div>
      )}

      {showOtpSection && (
        <div className="form-group relative mb-4">
          <label className="mb-1 block text-white" htmlFor="otp">
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
          />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {showOtpSection && (
        <button
          type="submit"
          className="w-full bg-[#8b0203] text-white py-2 px-4 rounded mt-2 hover:bg-[#9e2c2d]"
          disabled={loading}
        >
          Verify OTP
        </button>
      )}
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

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-start justify-between w-full mt-4 px-0 sm:px-4">
                  <div className="form-group">
                    <div className="form-check flex items-center">
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
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-check flex items-center">
                      <input
                        className="w-5 h-5 rounded-full border-2 border-white appearance-none checked:border-white checked:before:w-2 checked:before:h-2 checked:before:bg-[#de7008] checked:before:rounded-full checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:transform checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 relative mr-2"
                        type="radio"
                        name="contentSelector"
                        value="content2"
                        checked={selectedContent === "content2"}
                        onChange={() => toggleContent("content2")}
                      />
                      <label className="text-white cursor-pointer text-sm sm:text-base">
                        Login with OTP
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center w-full">
                  {selectedContent === "content1" && renderPasswordLogin()}
                  {selectedContent === "content2" && renderOtpLogin()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;