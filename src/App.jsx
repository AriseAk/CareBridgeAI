import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Main from './components/Main'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Donor from './components/Donor'
import Ngo from './components/Ngo'
import About from './components/About'
import Services from './components/Services'
import useLocation from './components/useLocation'
import HospitalLocator from './components/HospitalLocator'
import ChatBot from './components/ChatBot'

function App() {
  const { isLoading, position, error, getLocation } = useLocation();

  return (
    <>
    {/* Move Router to wrap everything */}
    <Router>
      <Navbar /> {/* Now Navbar can use Links safely */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/donors" element={<Donor />} />
        <Route path="/ngos" element={<Ngo />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/hospital" element={<HospitalLocator />} />
        
        {/* This is the route we just updated */}
        <Route path="/chatbot" element={<ChatBot />} /> 
      </Routes>
    </Router>
    </>
  )
}
export default App