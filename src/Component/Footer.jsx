import React from "react";
import logo from "../assets/ComLogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#212639] text-white py-10 px-6">
      <div className="w-full flex items-start flex-col md:flex-row gap-8 md:gap-30 ">
        {/* Logo Section */}
        <Link to="/">
          <div className="space-y-2 col-span-1">
            <img src={logo} alt="Logo" className="h-20 object-contain" />
          </div>
        </Link>


        <div className="flex items-start flex-col md:flex-row gap-8 md:gap-48">

          {/* Links */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/events" className="hover:underline">Events & Workshops</a></li>
              <li><a href="/refer-now" className="hover:underline">Refer and Earn</a></li>
              <li><a href="/blogs" className="hover:underline">Blogs</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Information</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Offers</a></li>
              <li><a href="/projects" className="hover:underline">Projects</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">About</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>



        {/* Newsletter */}
        <div className="space-y-2">
  <h4 className="text-sm text-gray-400">Subscribe to our newsletter</h4>
  <div className="flex w-full max-w-md mx-auto">
  <input
    type="email"
    placeholder="Enter your E-mail"
    className="flex-grow px-4 py-2 text-black bg-white outline-none placeholder:text-sm rounded-l"
  />
  <button className="bg-[#F9461C] text-white px-5 py-2 rounded-r">
    Subscribe
  </button>
</div>

</div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
        © 2025 Kee Club Piramal. A part of Piramal Realty. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
