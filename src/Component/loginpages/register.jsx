import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/lockated-logo.png";


const Register = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await axios.post(`${baseURL}users`, {
        email,
        firstname,
        lastname,
        mobile,
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("firstname", response.data.firstname);

        // Redirect to the home page
        navigate("/login");
        toast.success("Registered successfully");
      } else {
        setError("User already exists");
        toast.error("User already exists");
      }
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
    window.location.href = "/login"; // or your actual login URL
  };

  return (
    <div className="font-open-sans">
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
                    onSubmit={handlePasswordLogin}
                    className="mt-2 w-full"
                  >
                    <div className="relative mb-4">
                      <label className="mb-1 text-white block" htmlFor="email">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="email"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        placeholder="Enter fullname here..."
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="relative mb-4">
                      <label className="mb-1 text-white block" htmlFor="Email">
                        Email ID
                      </label>
                      <input
                        type="Email"
                        id="password"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        placeholder="Enter email id here..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="relative mb-4">
                      <label className="mb-1 text-white block" htmlFor="mobile">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
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
                      className="w-[282px] max-w-[75%] py-2 px-4 mx-auto block text-white bg-[#de7008] mt-4 rounded mb-2"
                    >
                      {loading ? "Register in..." : "Register"}
                    </button>
                    
                    <div className="mt-4 text-center text-white">
                      Already have an account?{" "}
                      <span
                        className="font-bold cursor-pointer"
                        onClick={goToLoginPage}
                      >
                        LOGIN
                      </span>
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

export default Register;