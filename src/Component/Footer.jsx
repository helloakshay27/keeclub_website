import React from 'react';
import logo from "../assets/lockated-logo.png"

const Footer = () => {
  return (
    <footer className="bg-[#212639] text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm md:text-base">
        <div className="mb-4 md:mb-0">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
          <a href="/contact" className="hover:underline">
            CONTACT US
          </a>
          <span className="hidden md:inline">|</span>
          <a href="/terms" className="hover:underline">
            TERMS AND CONDITIONS
          </a>
        </div>

        <div className="mt-4 md:mt-0 text-xs md:text-sm">
          *T&C Apply
        </div>
      </div>
    </footer>
  );
};

export default Footer;
