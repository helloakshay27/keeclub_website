import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/lockated-logo.png";


const Register = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock functions for demo
  const toast = {
    error: (message) => console.log(`Error: ${message}`),
    success: (message) => console.log(`Success: ${message}`)
  };
    const navigate = useNavigate();
  
  const config = {
      baseURL: "https://api-connect.panchshil.com/",
      logoUrl: logo,
  }
  
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) return;
    setMobile(value);
  };
  
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Phone number validation (Indian format: 10 digits, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    try {
      // Mock registration
      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      setError("User already exists");
      toast.error("User already exists");
    } finally {
      setLoading(false);
    }
  };

  const regiterPage = () => {
    navigate("/login");
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
                    <div className="form-group relative mb-4">
                      <label className="mb-1 block text-white" htmlFor="fullname">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullname"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        placeholder="Enter fullname here..."
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                      />
                    </div>
                    
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
                      <label className="mb-1 block text-white" htmlFor="mobile">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none mb-5"
                        placeholder="Enter mobile number here..."
                        id="mobile"
                        name="mobile"
                        value={mobile}
                        maxLength={10}
                        onChange={handleMobileChange}
                        required
                      />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    
                    <button
                      type="submit"
                      className="w-full sm:w-3/4 h-11 cursor-pointer bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] block"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "REGISTER"}
                    </button>
                    
                    <div className="mt-4 text-center text-white">
                      Already have an account?{" "}
                      <span
                        className="font-bold cursor-pointer hover:text-[#de7008]"
                        onClick={goToLoginPage}
                      >
                        LOGIN
                      </span>
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

export default Register;