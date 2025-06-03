import React from "react";
import { FaSearch } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <div className="flex items-center space-x-10 bg-[#24293c] p-2 rounded-lg">
          <img
            src="https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/4192015.png"
            alt="GoPhygital Logo"
            className="h-15 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* <nav className="flex items-center space-x-8 text-gray-700 font-medium">
            <button className="bg-[#eb5e28] hover:bg-[#cf4c1e] text-white font-semibold px-6 py-2 rounded-md">
              Setup
            </button>
          </nav> */}
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            {/* <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" /> */}
          </div>

          <div
            className="flex items-center text-black font-medium cursor-pointer"

          >
            {/* {`${firstName} ${lastName}`} <ChevronDown size={16} className="ml-1" /> */}
          </div>

          <div className="w-7 h-7 rounded-full border border-[#eb5e28] text-[#eb5e28] flex items-center justify-center text-sm font-bold "onClick={() => setShowModal(true)}>
            {firstName?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#eb5e28] text-white hover:bg-[#cf4c1e]"
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
