import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/lockated-logo.png";

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
    navigate("/register");
  };

  // const handlePasswordLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     toast.error("Please enter a valid email address.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${config.baseURL}/users/signin.json`, {
  //       user: {
  //         email,
  //         password,
  //       },
  //     });
      
  //     if (response.data.access_token) {
  //       localStorage.setItem("access_token", response.data?.access_token);
  //       sessionStorage.setItem("email", response.data?.email);
  //       sessionStorage.setItem("firstname", response.data?.firstname);
  //       sessionStorage.setItem("lastname", response.data?.lastname);
  //       sessionStorage.setItem("user_id", response.data?.id);
  //       sessionStorage.setItem("profile_icon", response?.data?.profile_icon_url);

  //       const lockRole = response?.data?.lock_role;
  //       if (lockRole) {
  //         localStorage.setItem("lock_role_name", lockRole.name);
  //         localStorage.setItem("lock_role_permissions", lockRole.permissions_hash);
  //       }
        
  //       navigate("/project-list");
  //       toast.success("Login successful");
  //     } else {
  //       toast.error("Login failed. Please check your credentials.");
  //     }
  //   } catch (err) {
  //     toast.error("Login failed. Please check your credentials.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
  
    // Mock login (no API call)
    if (email === "user@gmail.com" && password === "12345678") {
      // ✅ Store a fake token so PrivateRoute recognizes the login
      localStorage.setItem("authToken", "fake-token");
    
      // ✅ Continue with session info
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("firstname", "Rahul");
      sessionStorage.setItem("lastname", "Parihar");
      sessionStorage.setItem("user_id", "mock-user-id");
      sessionStorage.setItem("profile_icon", "https://via.placeholder.com/150");
    
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials. Please try again.");
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
      const response = await axios.post(`${config.baseURL}/generate_code`, {
        mobile,
      });
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
      const response = await axios.post(`${config.baseURL}/verify_code.json`, {
        mobile,
        otp,
      });

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        const lockRole = response.data?.lock_role;
        if (lockRole) {
          localStorage.setItem("lock_role_name", lockRole.name);
          localStorage.setItem("lock_role_permissions", lockRole.permissions_hash);
        }
        sessionStorage.setItem("email", response.data?.email);
        sessionStorage.setItem("firstname", response.data?.firstname);
        sessionStorage.setItem("lastname", response.data?.lastname);
        sessionStorage.setItem("user_id", response.data?.id);
        sessionStorage.setItem("profile_icon", response?.data?.profile_icon_url);
        localStorage.setItem("user_id", response.data?.id);
        navigate("/project-list");
        toast.success("Login successfully");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
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
        <div className="form-group relative mb-4">
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
        <div className="flex justify-end mt-2 mb-3 gap-2">
          <a className="text-white hover:text-[#de7008]" href="/forgot-password">
            Forgot password?
          </a>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handlePasswordLogin}
          type="submit"
          className="w-3/4 h-11 cursor-pointer bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] ml-11"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        {config.showRegisterButton && (
          <button 
            className="w-3/4 h-11 bg-transparent text-white border border-white rounded mt-6 mx-auto block uppercase hover:bg-white/10
 hover:bg-opacity-10"
            onClick={regiterPage}
            disabled={loading}
          >
            {loading ? "Register in..." : "REGISTER"}
          </button>
        )}
      </div>
    );
  };

  const renderOtpLogin = () => (
    <form onSubmit={handleVerifyOtp} className="mt-3 w-full max-w-[380px]">
      {OtpSection && (
        <div className="form-group relative mb-4">
          <label className="mb-1 block text-white" htmlFor="mobile">
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
            type="button"
            className="w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] ml-11"
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
      <section className="">
        <div className="container-fluid h-full">
          <div className={`row items-center h-full bg-cover bg-center bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')] justify-center`}>
            <div className="col-lg-7 col-md-7 h-screen flex items-center">
              <div className="border border-[rgba(58,58,51,0.4)] shadow-[0px_3px_8px_0px_rgba(217,217,217,0.08)] p-[3%_7%] mx-auto flex flex-col backdrop-blur bg-[#291b117f]">
                <img
                  className="w-[120px] h-[120px] md:w-[220px] md:h-[70px] mx-auto"
                  src={config.logoUrl}
                  alt="Logo"
                />

                <div className="flex gap-3 items-center justify-between w-full mt-4 px-4">
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
                      <label className="text-white cursor-pointer">
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
                      <label className="text-white cursor-pointer">
                        Login with OTP
                      </label>
                    </div>
                  </div>
                </div>

                {selectedContent === "content1" && renderPasswordLogin()}
                {selectedContent === "content2" && renderOtpLogin()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;