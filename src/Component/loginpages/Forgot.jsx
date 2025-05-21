import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import toast from "react-hot-toast";
// import { baseURL } from "../baseurl/apiDomain";
// import { LOGO_URL } from "../baseurl/apiDomain";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: "https://panchshil.gophygital.work/uploads/pms/company_setup/logo/226/Panchshil_logo.png",
    loginBgClass: "bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')]",
    logoStyle: { width: 100, height: 100, margin: "auto" },
    showRegisterButton: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    navigate(
      `/forgot-otp?email=${encodeURIComponent(
        email
      )}&mobile=${encodeURIComponent(mobile)}`
    );
    try {
      const response = await axios.post(`${baseURL}generate_code`, {
        email,
        mobile,
      });

      if (response.data.success) {
        toast.success("OTP Sent successfully");
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div>
      <main className="h-full w-full overflow-hidden">
        <section className={`min-h-screen w-full bg-cover bg-no-repeat bg-center ${config.loginBgClass}`}>
          <div className="container-fluid h-full">
            <div className={`row items-center h-full bg-cover bg-center bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')] justify-center`}>
              <div className="col-lg-7 col-md-7 h-screen flex items-center">            
                <div 
                  className="border border-[rgba(58,58,51,0.4)] shadow-[0px_3px_8px_0px_rgba(217,217,217,0.08)] p-[3%_7%] mx-auto flex flex-col backdrop-blur bg-[#291b117f]"
                  style={{ boxShadow: "0px 3px 8px 0px rgba(217, 217, 217, 0.08)" }}
                >
                  <img
                    className="w-[120px] h-[120px] md:w-[100px] md:h-[100px] mx-auto"
                    style={config.logoStyle}
                    src={config.logoUrl}
                    alt="Logo"
                  />
                  <form
                    className="mt-3 w-full max-w-[380px]"
                    id="forgetPasswordForm"
                    onSubmit={handleSubmit}
                  >
                    <h5 className="text-white text-xl mb-3 mt-6">Forgot Password?</h5>
                    <p className="text-white mb-6">
                      Enter you registered email ID below and we'll send you the
                      OTP to reset your password.
                    </p>
                    
                    <div className="mb-4 relative">
                      <label className="block text-white mb-2" htmlFor="forgetEmail">
                        Email ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        id="forgetEmail"
                        placeholder="Enter your registered email id..."
                        value={email || mobile || username}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEmail(value);
                          setMobile(value);
                          setUsername(value);
                        }}
                      />
                    </div>
                    
                    {error && (
                      <div className="text-red-500 mt-3 font-medium">{error}</div>
                    )}
                    
                    <button
                      type="submit"
                      className="w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] ml-11"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "NEXT"}
                    </button>
                  </form>

                  <div className="text-center mt-8">
                    <button
                      type="button"
                      onClick={goToLoginPage}
                      className="text-white hover:text-[#de7008] transition-colors"
                    >
                      Back to <span className="font-bold">LOGIN</span>
                    </button>
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

export default Forgot;