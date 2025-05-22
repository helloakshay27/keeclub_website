import { Routes, Route, useLocation, matchPath } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Header from './Component/Header'
import Footer from './Component/Footer'
import Blog from './Pages/Blog'
import Event from './Pages/Event'
import EventDetail from './Component/eventpage/EventDetail'
import Projects from './Pages/Projects'
import TransactionStatus from './Pages/TransactionStatus'
import { useMemo } from 'react'

import ProjectDetail from './Pages/Project-Details'
// import Login from './Pages/Login'
import SignIn from './Component/loginpages/signIn'
import Register from './Component/loginpages/register'
import Forgot from './Component/loginpages/Forgot'
import ForgotOtp from './Component/loginpages/ForgotOtp'
import CreatePassword from './Component/loginpages/CreatePassword'

import BlogDetailPage from './Component/blogpage/BlogDetailPage'

const routes = [
  { path: '/', element: <Home />, transparent: true },
  { path: '/about', element: <About />, transparent: false },
  { path: '/blogs', element: <Blog />, transparent: true },
  { path: '/events', element: <Event />, transparent: false },
  { path: '/event/:id', element: <EventDetail />, transparent: false },
  { path: '/projects', element: <Projects />, transparent: true },
  { path: '/transactionstatus', element: <TransactionStatus />, transparent: true },
  { path: '/Project-Details/:id', element: <ProjectDetail />, transparent: false },

  { path: '/login', element: <SignIn />, transparent: true, hideLayout: true },
  { path: '/register', element: <Register />, transparent: true, hideLayout: true },
  { path: '/forgot-password', element: <Forgot />, transparent: true, hideLayout: true },
  { path: '/forgot-otp', element: <ForgotOtp />, transparent: true, hideLayout: true },
  { path: '/reset-password', element: <CreatePassword />, transparent: true, hideLayout: true },

  { path: '/blog/:id', element: <BlogDetailPage />, transparent: true },
]


function App() {
  const location = useLocation()

  const { isTransparent, hideLayout } = useMemo(() => {
    const matchedRoute = routes.find(route => matchPath(route.path, location.pathname))
    return {
      isTransparent: matchedRoute?.transparent ?? false,
      hideLayout: matchedRoute?.hideLayout ?? false,
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header key={location.pathname} isTransparent={isTransparent} />}
      <main className={`flex-1 ${!hideLayout && !isTransparent ? 'pt-20 sm:pt-28' : ''}`} style={{ flex: 1 }}>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}


export default App
