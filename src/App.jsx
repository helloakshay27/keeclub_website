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
import BlogDetailPage from './Component/blogpage/BlogDetailPage'

const routes = [
  { path: '/', element: <Home />, transparent: true },
  { path: '/about', element: <About />, transparent: false },
  { path: '/blogs', element: <Blog />, transparent: true },
  { path: '/events', element: <Event />, transparent: false },
  { path: '/event/:id', element: <EventDetail />, transparent: false },
  { path: '/projects', element: <Projects />, transparent: true },
  { path: '/transactionstatus', element: <TransactionStatus />, transparent: true },
  { path :'/blog/:id', element : <BlogDetailPage />, transparent: true },


]

function App() {
  const location = useLocation()

  const isTransparent = useMemo(() => {
    return routes.some(route => matchPath(route.path, location.pathname) && route.transparent)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header isTransparent={isTransparent} />
      <main className={`flex-1 ${isTransparent ? 'pt-0' : 'pt-20 sm:pt-28'}`} style={{ flex: 1 }}>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
