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

const routeConfigs = [
  { path: '/', element: <Home />, transparent: true },
  { path: '/about', element: <About />, transparent: false },
  { path: '/blogs', element: <Blog />, transparent: true },
  { path: '/events', element: <Event />, transparent: true },
  { path: '/event/:id', element: <EventDetail />, transparent: false },
  { path: '/projects', element: <Projects />, transparent: true },
  { path: '/Project-Details/:id', element: <ProjectDetail />, transparent: false },

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

  // Update isMobile on resize
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
      <main
        className="flex-1"
        style={{ paddingTop: hideLayout ? 0 : `${headerHeightPx}px` }}
      >
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

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{ backgroundColor: 'white' }}
        />
        {!hideLayout && <Footer />}
      </main>
    </div>
  );
}

export default App;
