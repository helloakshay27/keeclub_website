import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ComLogo from "../assets/ComLogo.png"
import { useNavigate } from "react-router-dom";

const Header = ({ isTransparent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Helper function to check if a link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get link classes
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
          <li className={getLinkClasses('/')}>
            <Link to="/">HOME</Link>
          </li>
          <li className={getLinkClasses('/refer-now')}>
            <Link to="/refer-now">REFER AND EARN</Link>
          </li>
          <li className={getLinkClasses('/events')}>
            <Link to="/events">EVENTS</Link>
          </li>
          <li className={getLinkClasses('/blogs')}>
            <Link to="/blogs">BLOGS</Link>
          </li>
          <li className={getLinkClasses('/promotions')}>
            <Link to="/promotions">REDEMPTION</Link>
          </li>
          <li className={getLinkClasses('/projects')}>
            <Link to="/projects">PROJECTS</Link>
          </li>

          {isAuthenticated ? (
            <li style={{ marginTop:'-4px'}}>
              <div className="w-7 h-7 rounded-full border border-[#fff] text-[#fff] flex items-center justify-center text-sm font-bold cursor-pointer" onClick={() => setShowModal(true)}>
                G
              </div>
            </li>
          ) : (
            <li className={getLinkClasses('/login')}>
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
            <li className={getLinkClasses('/')}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            </li>
            <li className={getLinkClasses('/refer-now')}>
              <Link to="/refer-now" onClick={() => setIsMobileMenuOpen(false)}>
                REFER AND EARN
              </Link>
            </li>
            <li className={getLinkClasses('/events')}>
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>EVENTS</Link>
            </li>
            <li className={getLinkClasses('/blogs')}>
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
            </li>
            <li className={getLinkClasses('/promotions')}>
              <Link to="/promotions" onClick={() => setIsMobileMenuOpen(false)}>REDEMPTION</Link>
            </li>
            <li className={getLinkClasses('/projects')}>
              <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)}>PROJECTS</Link>
            </li>

            {isAuthenticated ? (
              <li>
                <div className="hover:text-[#fa4615] w-7 h-7 rounded-full border border-[#ffffff] text-[#ffffff] flex items-center justify-center text-sm font-bold cursor-pointer" onClick={() => setShowModal(true)}>
                  G
                </div>
              </li>
            ) : (
              <li className={getLinkClasses('/login')}>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN</Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]" style={{ color: '#000' }}>
      
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-center">Profile Menu</h2>

      {/* User Info */}
    

      {/* Menu Options */}
      <div className="space-y-2 mb-6">
        <Link 
          to="/orders" 
          className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setShowModal(false)}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            📦
          </div>
          <div>
            <div className="font-medium">My Orders</div>
            <div className="text-sm text-gray-500">Track and manage orders</div>
          </div>
        </Link>

        <Link 
          to={`/dashboard/transactions/${id}`} 
          className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setShowModal(false)}
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            💳
          </div>
          <div>
            <div className="font-medium">Dashboard</div>
            <div className="text-sm text-gray-500">View transactions & points</div>
          </div>
        </Link>

        <div 
          className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => {
            setShowModal(false);
            setTimeout(() => {
              const confirmSignOut = window.confirm("Are you sure you want to sign out?");
              if (confirmSignOut) {
                handleSignOut();
              }
            }, 100);
          }}
        >
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            🚪
          </div>
          <div>
            <div className="font-medium text-red-600">Sign Out</div>
            <div className="text-sm text-gray-500">Exit your account</div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </div>
      
    </div>
  </div>
)}

    </header>
  );
};

export default Header;
