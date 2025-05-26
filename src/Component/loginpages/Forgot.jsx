import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/lockated-logo.png";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Mock functions for demo (like in register page)
  const toast = {
    error: (message) => console.log(`Error: ${message}`),
    success: (message) => console.log(`Success: ${message}`)
  };

  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: logo,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Mock API call - navigate to OTP page
      navigate(
        `/forgot-otp?email=${encodeURIComponent(
          email
        )}&mobile=${encodeURIComponent(mobile)}`
      );
      
      // Simulate API call
      toast.success("OTP Sent successfully");
    } catch (err) {
      setError("An error occurred");
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToLoginPage = () => {
    navigate("/login");
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
                      id="forgetPasswordForm"
                      onSubmit={handleSubmit}
                    >
                      <h5 className="text-white text-xl mb-3 mt-6">Forgot Password?</h5>
                      <p className="text-white mb-6">
                        Enter you registered email ID below and we'll send you the
                        OTP to reset your password.
                      </p>
                      
                      <div className="form-group relative mb-4">
                        <label className="mb-1 block text-white" htmlFor="forgetEmail">
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
                        className="w-full sm:w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default Forgot;