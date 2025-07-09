import React from "react";
import { FaSearch } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ComLogo from "../../assets/ComLogo.png"

const DashHeader = () => {
  const firstName = sessionStorage.getItem("firstname") || "Guest";
  const lastName = sessionStorage.getItem("lastname") || "";

  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 h-20 bg-white shadow-md">
        <div className="flex items-center space-x-10 bg-[#24293c] p-2 rounded-sm">
          <img
            src={ComLogo}
            alt="GoPhygital Logo"
            className="h-13 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          {/* ... */}
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            {/* ... */}
          </div>

          <div
            className="flex items-center text-black font-medium cursor-pointer"
          >
            {/* ... */}
          </div>
    
          <div className="w-7 h-7 rounded-full border border-[#eb5e28] text-[#eb5e28] flex items-center justify-center text-sm font-bold " onClick={() => setShowModal(true)}>
            {firstName?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-150">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Sign Out</h2>
            <div className="mb-4">
              {/* <div className="font-medium"> {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}</div> */}
              {/* <div className="text-gray-500 text-sm">
                {localStorage.getItem("email") || "No email"}
              </div> */}
            </div>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#f54a00] text-white hover:bg-[#cf4c1e]"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashHeader;
