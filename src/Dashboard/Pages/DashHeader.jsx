import React from "react";
import { FaSearch } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ComLogo from "../../assets/ComLogo.png";

const DashHeader = () => {
  const firstName = sessionStorage.getItem("firstname") || "Guest";
  const lastName = sessionStorage.getItem("lastname") || "";
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
    toast.success("Signed out successfully");
  };

    const getLinkClasses = (path) => {
      return classNames(
        "hover:text-[#fa4615] cursor-pointer transition-colors duration-200",
        {
          "text-[#fa4615] font-semibold": isActiveLink(path),
          "": !isActiveLink(path)
        }
      );
    };

  return (
    <>
      <header className="flex items-center justify-between px-8 h-20 bg-white shadow-md">
        {/* Logo Section */}
        <div className="flex items-center bg-[#24293c] p-2 rounded-sm">
          <img
            src={ComLogo}
            alt="GoPhygital Logo"
            className="h-13 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Navigation and Profile Section */}
        <div className="flex items-center space-x-8">
          {/* Navigation Menu */}
          <nav>
            <ul className="flex items-center space-x-6 text-sm font-medium">
              <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/">HOME</Link>
              </li>
              <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/refer-now">REFER AND EARN</Link>
              </li>
              <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/events">EVENTS</Link>
              </li>
              <li className={getLinkClasses('/promotions')}>
                <Link to="/promotions">REDEMPTION</Link>
              </li>
              {/* <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/blogs">BLOGS</Link>
              </li>
              <li className="hover:text-[#fa4615] cursor-pointer">OFFERS</li> */}
              <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/projects">PROJECTS</Link>
              </li>
            </ul>
          </nav>

          {/* Profile Icon */}
          <div
            className="w-7 h-7 rounded-full border border-[#eb5e28] text-[#eb5e28] flex items-center justify-center text-sm font-bold cursor-pointer"
            onClick={() => setShowModal(true)}
          >
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
                className="px-4 py-2 rounded bg-[#f9461c] text-white hover:bg-[#cf4c1e]"
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
