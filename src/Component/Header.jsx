import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ComLogo from "../assets/ComLogo.png"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Header = ({ isTransparent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
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
    const authToken = localStorage.getItem('salesforce_access_token');
    setIsAuthenticated(!!authToken);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Signed out successfully");
    // Force page reload after sign out
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
            <Link to="/dashboard/transactions">EVENTS</Link>
          </li>
          {/* <li className={getLinkClasses('/blogs')}>
            <Link to="/blogs">BLOGS</Link>
          </li> */}
          <li className={getLinkClasses('/promotions')}>
            <Link to="/promotions">REDEMPTION</Link>
          </li>
          {/* <li className={getLinkClasses('/projects')}>
            <Link to="/projects">PROJECTS</Link>
          </li> */}

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
            {/* <li className={getLinkClasses('/blogs')}>
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
            </li> */}
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

      {/* Only show profile menu modal if sign out modal is not open */}
      {showModal && !showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]" style={{ color: '#000' }}>
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4 text-center">Profile Menu</h2>
            {/* Menu Options */}
            <div className="space-y-2 mb-6">
              <Link 
                to="/orders" 
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">📦</div>
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
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">💳</div>
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
                    setShowSignOutModal(true);
                  }, 100);
                }}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">🚪</div>
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

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-xs mx-auto text-center border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#fa46151a] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fa4615" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m10.5 0v10.125A2.625 2.625 0 0116.125 21.75H7.875A2.625 2.625 0 015.25 19.125V9m13.5 0H5.25m13.5 0l-1.5-1.5m-10.5 1.5l1.5-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Sign Out</h3>
              <p className="mb-6 text-gray-600 text-base">Are you sure you want to sign out?</p>
            </div>
            <div className="flex justify-center gap-3 mt-2">
              <button
                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-full bg-[#fa4615] text-white font-semibold hover:bg-[#d6451d] transition-colors shadow-sm"
                onClick={() => {
                  setShowSignOutModal(false);
                  handleSignOut();
                }}
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
