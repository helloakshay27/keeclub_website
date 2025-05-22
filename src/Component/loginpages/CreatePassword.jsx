import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/lockated-logo.png";


const CreatePassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const mobile = queryParams.get("mobile");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const navigate = useNavigate();

  const config = {
    baseURL: "https://api-connect.panchshil.com/",
    logoUrl: logo,
    loginBgClass: "bg-[url('https://vendor.panchshil.com/assets/pan_logo-4e1c867e2fada5efc385ef5c565a0ad3b533cd396d1ed187a0bc7fdec161a35a.jpg')]",
    showRegisterButton: true,
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
      setError("Password must be between 8 to 32 characters.");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter.");
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number.");
      setLoading(false);
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      setError("Password must contain at least one special character.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseURL}users/forgot_password.json`,
        {
          user: {
            email_or_mobile: email,
            password: newPassword,
          },
        }
      );
      navigate("/");

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("firstname", response.data.firstname);

        navigate("/password-success");
        toast.success("Password reset successfully!");
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during password reset. Please try again.");
    } finally {
      setLoading(false);
    }
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
                    className="w-full max-w-[380px]"
                    id="createPasswordForm"
                    onSubmit={handlePasswordReset}
                  >
                    <div className="flex justify-between items-baseline mb-4">
                      {/* Back button and pagination can be added here if needed */}
                    </div>
                    <h6 className="text-white text-xl mb-3 mt-6">Create New Password</h6>
                    <p className="text-white mb-3">
                      Set a strong password for your account
                    </p>
                    
                    <div className="mb-3 relative">
                      <label className="text-white mb-4" htmlFor="newPassword">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        id="newPassword"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <span className="text-white mr-2">•</span>
                          <p className={`text-sm ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`}>
                            Minimum 8 characters
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white mr-2">•</span>
                          <p className={`text-sm ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`}>
                            At least one uppercase letter
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white mr-2">•</span>
                          <p className={`text-sm ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`}>
                            At least one number
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white mr-2">•</span>
                          <p className={`text-sm ${/[!@#$%^&*]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`}>
                            At least one special character (!@#$%)
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3 relative">
                      <label className="text-white mb-4" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 rounded mb-2 bg-white placeholder-gray-400 text-black outline-none"
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && <div className="text-red-500 mb-3">{error}</div>}
                    
                    <button
                      type="submit"
                      className="w-3/4 h-11 bg-[#de7008] text-white py-2 px-4 rounded mt-2 mx-auto hover:bg-[#de7008] ml-11"
                      disabled={loading}
                    >
                      {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
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

export default CreatePassword;