import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, matchPath, Navigate } from 'react-router-dom';
import './App.css';

// Pages and Components
import Home from './Pages/Home';
import About from './Pages/About';
import Blog from './Pages/Blog';
import Event from './Pages/Event';
import EventDetail from './Component/eventpage/EventDetail';
import Projects from './Pages/Projects';
import ProjectDetail from './Pages/ProjectDetails';
import SignIn from './Component/loginpages/signIn';
import Register from './Component/loginpages/register';
import Forgot from './Component/loginpages/Forgot';
import ForgotOtp from './Component/loginpages/ForgotOtp';
import CreatePassword from './Component/loginpages/CreatePassword';
import BlogDetailPage from './Component/blogpage/BlogDetailPage';
import ReferNow from './Pages/refer_now';
import Header from './Component/Header';
import Footer from './Component/Footer';
import RootLayout from './Pages/Layout/RootLayout';
import TransactionStatuss from './Dashboard/TransactionStatuss';
import Services from './Dashboard/Services';
import HotelList from './Dashboard/HotelList';
import HotelCheckout from './Dashboard/HotelCheckout';
import HotelBooks from './Dashboard/HotelBooks';
import HotelDetails from './Dashboard/HotelDetails';
import PrivateRoute from './Dashboard/Pages/PrivateRoute';
import PageNotFound from './Pages/PageNotFound';
import { ToastContainer } from 'react-toastify';

// Promotion Pages
import Promotions from './Pages/Promotions';
import PromotionDetail from './Pages/PromotionDetail';
import RedeemPoints from './Pages/RedeemPoints';
import OrderConfirmation from './Pages/OrderConfirmation';
import OrderSuccess from './Pages/OrderSuccess';
import TrackOrder from './Pages/TrackOrder';
import HotelsRedemption from './Pages/HotelsRedemption';
import Orders from './Pages/Orders';
import OrderDetail from './Pages/OrderDetail';

const routeConfigs = [
  { path: '/', element: <Home />, transparent: true },
  { path: '/about', element: <About />, transparent: false },
  { path: '/blogs', element: <Blog />, transparent: true },
  { path: '/events', element: <Event />, transparent: true },
  { path: '/event/:id', element: <EventDetail />, transparent: false },
  { path: '/projects', element: <Projects />, transparent: true },
  { path: '/Project-Details/:id', element: <ProjectDetail />, transparent: false },

  // Promotion Routes
  { path: '/promotions', element: <Promotions />, transparent: true },
  { path: '/promotion-detail/:id', element: <PromotionDetail />, transparent: false },
  { path: '/redeem-points', element: <RedeemPoints />, transparent: false },
  { path: '/order-confirmation', element: <OrderConfirmation />, transparent: false },
  { path: '/order-success', element: <OrderSuccess />, transparent: false },
  { path: '/orders', element: <Orders />, transparent: false },
  { path: '/order-detail/:orderId', element: <OrderDetail />, transparent: false },
  { path: '/track-order/:orderId', element: <TrackOrder />, transparent: false },
  { path: '/hotels-redemption', element: <HotelsRedemption />, transparent: false },

  { path: '/login', element: <SignIn />, transparent: true, hideLayout: true },
  { path: '/register', element: <Register />, transparent: true, hideLayout: true },
  { path: '/forgot-password', element: <Forgot />, transparent: true, hideLayout: true },
  { path: '/forgot-otp', element: <ForgotOtp />, transparent: true, hideLayout: true },
  { path: '/reset-password', element: <CreatePassword />, transparent: true, hideLayout: true },
  { path: '/refer-now', element: <ReferNow />, transparent: false },

  { path: '/blog/:id', element: <BlogDetailPage />, transparent: true },
  { path: '*', element: <PageNotFound />, transparent: true, hideLayout: true },
];




function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [walletData, setWalletData] = useState(null); // store API response
  const [error, setError] = useState(null);

  // // inside useEffect in App()
  // useEffect(() => {
  //   const fetchWalletDetails = async () => {
  //     try {
  //       const response = await fetch(
  //         "/salesforce/services/data/v64.0/query/?q=SELECT+Id,Name,Loyalty_Balance__c,Opportunity__c,Phone_Mobile_Number__c,Total_Points_Credited__c,Total_Points_Debited__c,Total_Points_Expired__c,Active__c+FROM+Loyalty_Member__c+WHERE+Name+=+'PRLxLM-100000'",
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer 00De0000006JPl!AQEATuKY05AsQzxPHBgCHFA4Z7s5f.lZnSXT6_RtX3RJT_2gxj40BkF0jECWtZGFEVXCwrUagII1gCNE.6G..0sPcbWfA`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log("✅ Wallet API Response:", data);
  //       setWalletData(data);
  //     } catch (err) {
  //       console.error("❌ Wallet API Error:", err);
  //       setError(err.message);
  //     }
  //   };

  //   fetchWalletDetails();
  // }, []);

  // your existing resize, matchedRoute, etc.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const matchedRoute = routeConfigs.find(route =>
    matchPath(route.path, location.pathname)
  );

  const isTransparent = matchedRoute?.transparent ?? false;
  const hideLayout = matchedRoute?.hideLayout || location.pathname.startsWith('/dashboard');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isSpecialMobilePage =
    (matchPath('/event/:id', location.pathname) || matchPath('/Project-Details/:id', location.pathname)) &&
    isMobile;

  const headerHeightPx = hideLayout ? 0 : isSpecialMobilePage ? 120 : isMobile ? 0 : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header key={location.pathname} isTransparent={isTransparent} />}
      <main className="flex-1" style={{ paddingTop: hideLayout ? 0 : `${headerHeightPx}px` }}>

        {/* Just for testing: show API status */}
        {walletData && (
          <div style={{ background: "#d1fae5", padding: "10px", margin: "10px" }}>
            ✅ API Working: Loyalty Balance = {walletData?.records?.[0]?.Loyalty_Balance__c}
          </div>
        )}
        {error && (
          <div style={{ background: "#fee2e2", padding: "10px", margin: "10px" }}>
            ❌ API Error: {error}
          </div>
        )}

        <Routes>
          {routeConfigs.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route element={<RootLayout />}>
              <Route index element={<Navigate to="transactions" replace />} />
              <Route path="transactions/:id" element={<TransactionStatuss />} />
              <Route path="hotel-list" element={<HotelList />} />
              <Route path="hotel-checkout" element={<HotelCheckout />} />
              <Route path="hotel-book" element={<HotelBooks />} />
              <Route path="hotel-details" element={<HotelDetails />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>

        <ToastContainer />
        {!hideLayout && <Footer />}
      </main>
    </div>
  );
}

export default App;

