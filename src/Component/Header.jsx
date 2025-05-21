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
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 sm:px-8 flex items-center justify-between',
        {
          'bg-[#24293c] text-white shadow-md py-2 sm:py-1':
            (isTabletOrMobile && isMobileMenuOpen) || !isTransparent || scrolled,
          'bg-transparent text-white py-4 sm:py-5':
            isTransparent && !scrolled && !(isTabletOrMobile && isMobileMenuOpen),
        }
      )}
    >

      <div className="flex items-center">
        <a href="/">
          <img
            src="https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/4192015.png"
            alt="Kclub Logo"
            className={classNames("w-auto transition-all duration-300", {
              'h-12 md:h-18': scrolled,
              'h-12 md:h-28': !scrolled,
            })}
          />

        </a>
      </div>


      <nav className="hidden lg:block">
        <ul className="flex space-x-6 font-medium text-sm">
          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/">HOME</Link>
          </li>
          <li className="hover:text-[#fa4615] cursor-pointer">REFER AND EARN</li>
          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/transactionstatus">TRANSACTION STATUS</Link>
          </li>

          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/events">EVENTS</Link>
          </li>
          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/blogs">BLOGS</Link>
          </li>
          <li className="hover:text-[#fa4615] cursor-pointer">OFFERS</li>
          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/projects">PROJECTS</Link>
          </li>

          <li className="hover:text-[#fa4615] cursor-pointer">
           <Link to="/login" >LOGIN</Link></li>
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
        <div className="absolute top-full left-0 w-full bg-[#24293c] text-white lg:hidden px-6 py-4 shadow-md">
          <ul className="flex flex-col space-y-4 font-medium text-sm">
            <li className="hover:text-[#fa4615] cursor-pointer">HOME</li>
            <li className="hover:text-[#fa4615] cursor-pointer">REFER AND EARN</li>
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>TRANSACTION STATUS</Link>
            </li>

            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>EVENTS</Link>
            </li>
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
            </li>
            <li className="hover:text-orange-[#fa4615] cursor-pointer">OFFERS</li>
            <li className="hover:text-orange-[#fa4615] cursor-pointer">PROJECTS</li>
            <li className="hover:text-[#fa4615] cursor-pointer">Login</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
