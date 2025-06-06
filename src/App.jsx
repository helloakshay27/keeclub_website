import { Routes, Route, useLocation, matchPath, Navigate } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Header from './Component/Header'
import Footer from './Component/Footer'
import Blog from './Pages/Blog'
import Event from './Pages/Event'
import EventDetail from './Component/eventpage/EventDetail'
import Projects from './Pages/Projects'

import ProjectDetail from './Pages/ProjectDetails'
import SignIn from './Component/loginpages/signIn'
import Register from './Component/loginpages/register'
import Forgot from './Component/loginpages/Forgot'
import ForgotOtp from './Component/loginpages/ForgotOtp'
import CreatePassword from './Component/loginpages/CreatePassword'

import BlogDetailPage from './Component/blogpage/BlogDetailPage'
import RootLayout from './Pages/Layout/RootLayout'
import TransactionStatuss from './Dashboard/TransactionStatuss'
import PrivateRoute from './Dashboard/Pages/PrivateRoute'
import PageNotFound from './Pages/PageNotFound'
import Services from './Dashboard/Services'
// import HotelList from './Dashboard/HotelList'
import HotelCheckout from './Dashboard/HotelCheckout'
import HotelBooks from './Dashboard/HotelBooks'
// import HotelDetails from './Dashboard/HotelDetails'
import ReferNow from './Pages/refer_now'
import { ToastContainer } from 'react-toastify'

const routeConfigs = [
  { path: '/', element: <Home />, transparent: true },
  { path: '/about', element: <About />, transparent: false },
  { path: '/blogs', element: <Blog />, transparent: true },
  { path: '/events', element: <Event />, transparent: false },
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
  { path: '*', element: <PageNotFound />, transparent: true, hideLayout: true }
];



function App() {
  const location = useLocation()
  const matchedRoute = routeConfigs.find(route => matchPath(route.path, location.pathname));
  const isTransparent = matchedRoute?.transparent ?? false;
  const hideLayout = matchedRoute?.hideLayout || location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header key={location.pathname} isTransparent={isTransparent} />}
      <main className={`flex-1 `}>
        <Routes>
          {routeConfigs.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {/* Dashboard layout with nested routes */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route element={<RootLayout />}>
            <Route index element={<Navigate to="transactions" replace />} />
            <Route path="transactions" element={<TransactionStatuss />} />
              <Route path="hotel-list" element={<HotelList />} />
              <Route path="hotel-checkout" element={<HotelCheckout />} />
              <Route path="hotel-books" element={<HotelBooks />} />
              <Route path="hotel-details" element={<HotelDetails />} />
              {/* Add more dashboard routes here */}

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
        />
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}


export default App
