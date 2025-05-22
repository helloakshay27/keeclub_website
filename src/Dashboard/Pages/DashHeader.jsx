import React from "react";
import { FaSearch } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashHeader = () => {
  const firstName = sessionStorage.getItem("firstname") || "Guest";
  const lastName = sessionStorage.getItem("lastname") || "";

  const naviagte =useNavigate()

  return (
    <header className="flex items-center justify-between px-8 h-20 bg-white shadow-md">
      <div className="flex items-center space-x-10">
        <img
          src="https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/4192015.png"
          alt="GoPhygital Logo"
          className="h-15 w-auto cursor-pointer"
          onClick={()=> naviagte("/")}

        />

        <nav className="flex items-center space-x-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-black">Home</a>
          <a href="#" className="hover:text-black">Dashboard</a>
          <button className="bg-[#eb5e28] hover:bg-[#cf4c1e] text-white font-semibold px-6 py-2 rounded-md">
            Setup
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
        </div>

        <div className="flex items-center text-black font-medium">
          {`${firstName} ${lastName}`} <ChevronDown size={16} className="ml-1" />
        </div>

        <div className="w-7 h-7 rounded-full border border-[#eb5e28] text-[#eb5e28] flex items-center justify-center text-sm font-bold">
          {firstName?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default DashHeader;
