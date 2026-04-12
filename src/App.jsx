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

  // 1. State and toggle function (You already had this!)
  const [isLightMode, setIsLightMode] = useState(false);
  
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-700 ${isLightMode ? "bg-slate-50" : "bg-[#020617]"}`}>

        <Navbar isLightMode={isLightMode} toggleTheme={toggleTheme} /> 
        
        <Routes>
          <Route path="/" element={<Main isLightMode={isLightMode} />} />
          <Route path="/donors" element={<Donor isLightMode={isLightMode} />} />
          <Route path="/ngos" element={<Ngo isLightMode={isLightMode} />} />
          <Route path="/about" element={<About isLightMode={isLightMode} />} />
          <Route path="/services" element={<Services isLightMode={isLightMode} />} />
          <Route path="/hospital" element={<HospitalLocator isLightMode={isLightMode} />} />
          <Route path="/chatbot" element={<ChatBot isLightMode={isLightMode} />} /> 
        </Routes>
        
      </div>
    </Router>
  )
}

export default App