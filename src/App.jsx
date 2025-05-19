import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Header from './Component/Header'
import Footer from './Component/Footer'
import Blog from './Pages/Blog'
import Event from './Pages/Event'
import Projects from './Pages/Projects'

function App() {
  const location = useLocation()
  const isTransparent = location.pathname === '/' || location.pathname === '/blogs '
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isTransparent={isTransparent} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/events" element={<Event />} />
          <Route path="/projects" element={<Projects />} />

         
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App
