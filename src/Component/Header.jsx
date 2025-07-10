import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComLogo from "../assets/ComLogo.png"
import { useNavigate } from "react-router-dom";

const Header = ({ isTransparent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  let id = localStorage.getItem("member_id");

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

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
     toast.success("Signed out successfully");
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
            src={ComLogo}
            alt="Kclub Logo"
            className={classNames(
              "w-auto transition-all duration-300",
              scrolled ? "h-10 md:h-16" : "h-16 md:h-24"
            )}
          />

        </a>
      </div>


      <nav className="hidden lg:block">
        <ul className="flex space-x-6 font-medium align-items-start text-sm">
          <li className="hover:text-[#fa4615] cursor-pointer">
            <Link to="/">HOME</Link>
          </li>
          <Link to="/refer-now" className="hover:text-[#fa4615] cursor-pointer">REFER AND EARN</Link>

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

          {isAuthenticated ? (
            <li style={{ marginTop:'-4px'}}>
              <div className="w-7 h-7 rounded-full border border-[#fff] text-[#fff] flex items-center justify-center text-sm font-bold cursor-pointer" onClick={() => setShowModal(true)}>
                G
              </div>
            </li>
          ) : (
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/login">LOGIN</Link>
            </li>
          )}
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
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>

            </li>
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/refer-now" onClick={() => setIsMobileMenuOpen(false)}>
                REFER AND EARN
              </Link>
            </li>

            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>EVENTS</Link>
            </li>
            <li className="hover:text-[#fa4615] cursor-pointer">
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
            </li>
            <li className="hover:text-orange-[#fa4615] cursor-pointer">OFFERS</li>
            <li className="hover:text-orange-[#fa4615] cursor-pointer">
              <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)}>PROJECTS</Link>

            </li>

            {isAuthenticated ? (
              <li>
                <div className="hover:text-[#fa4615] w-7 h-7 rounded-full border border-[#ffffff] text-[#ffffff] flex items-center justify-center text-sm font-bold cursor-pointer" onClick={() => setShowModal(true)}>
                  G
                </div>
              </li>
            ) : (
              <li className="hover:text-[#fa4615] cursor-pointer">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN</Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]" style={{ color: '#000' }}>
      
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-center">Sign Out</h2>

      {/* Optional User Info (currently commented out) */}
      {/* 
      <div className="mb-4 text-center">
        <div className="font-medium">
          {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}
        </div>
        <div className="text-gray-500 text-sm">
          {localStorage.getItem("email") || "No email"}
        </div>
      </div> 
      */}

      {/* Confirmation Text */}
      <p className="mb-4 text-center">Are you sure you want to sign out?</p>

      {/* Go to Dashboard Button */}
      <div className="flex justify-center mb-6">
        <Link to={`/dashboard/transactions/${id}`} className="text-blue-500 hover:underline cursor-pointer">
          <button className="px-4 py-2 rounded bg-[#f54a00] text-white hover:bg-[#cf4c1e]">
            Go to dashboard
          </button>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-10">
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

    </header>
  );
};

export default Header;
