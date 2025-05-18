import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ isTransparent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    if (isTransparent) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (isTransparent) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isTransparent]);

  useEffect(() => {
    const checkDevice = () => {
      setIsTabletOrMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 w-full z-50 transition-colors duration-300 px-6 sm:px-8 py-2 sm:py-3 flex items-center justify-between',
        {
          'bg-blue-950 text-white shadow-md':
            (isTabletOrMobile && isMobileMenuOpen) || !isTransparent || scrolled,
          'bg-transparent text-white': isTransparent && !scrolled && !(isTabletOrMobile && isMobileMenuOpen),
        }
      )}
    >
      <div className="flex items-center">
        <img
          src="https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/4192015.png"
          alt="Kclub Logo"
          className="h-10 md:h-16 lg:h-25 w-auto"
        />
      </div>

      <nav className="hidden lg:block">
        <ul className="flex space-x-6 font-medium">
          <li className="hover:text-orange-400 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-orange-400 cursor-pointer">REFER AND EARN</li>
          <li className="hover:text-orange-400 cursor-pointer">EVENTS</li>
          <li className="hover:text-orange-400 cursor-pointer">
            <Link to="/blogs">BLOGS</Link>
          </li>
          <li className="hover:text-orange-400 cursor-pointer">OFFERS</li>
          <li className="hover:text-orange-400 cursor-pointer">PROJECTS</li>
          <li className="hover:text-orange-400 cursor-pointer">LOGIN</li>
        </ul>
      </nav>

      <button
        className="lg:hidden text-white z-50"
        onClick={toggleMobileMenu}
        aria-label="Toggle Mobile Menu"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-950 text-white lg:hidden px-6 py-4 shadow-md">
          <ul className="flex flex-col space-y-4 font-medium">
            <li className="hover:text-orange-400 cursor-pointer">HOME</li>
            <li className="hover:text-orange-400 cursor-pointer">REFER AND EARN</li>
            <li className="hover:text-orange-400 cursor-pointer">EVENTS</li>
            <li className="hover:text-orange-400 cursor-pointer">
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
            </li>            
            <li className="hover:text-orange-400 cursor-pointer">OFFERS</li>
            <li className="hover:text-orange-400 cursor-pointer">PROJECTS</li>
            <li className="hover:text-orange-400 cursor-pointer">Login</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
