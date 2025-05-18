import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#212639] text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-sm md:text-base space-y-2 md:space-y-0 md:space-x-4">
        <a href="/contact" className="hover:underline">
          CONTACT US
        </a>
        <span className="hidden md:inline">|</span>
        <a href="/terms" className="hover:underline">
          TERMS AND CONDITIONS
        </a>
      </div>
    </footer>
  );
};

export default Footer;
