import React from 'react';
import logo from "../../assets/lockated-logo.png";

const DashFooter = () => {
    return (
        <footer className="fixed bottom-0 w-full bg-white shadow-[0_-2px_4px_rgba(14,30,37,0.12),0_-2px_16px_rgba(14,30,37,0.32)] z-10">
        <div className="flex justify-center">
          <div className="flex items-center py-3 space-x-2 relative left-[-100px]">
            <span className="text-sm text-black">Powered by</span>
            <img
              alt="logo"
              className="h-6"
              src={logo}
            />
          </div>
        </div>
      </footer>
      

    );
};

export default DashFooter;
