import React from 'react'
import { Mic, Phone } from "lucide-react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate , Link } from 'react-router-dom'

const Main = () => {
  const [role, setRole] = useState("refugees");
  const navigate = useNavigate();

   const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="h-{93vh} flex flex-col justify-between bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Website Title & About Section */}
      <header className="relative text-center p-6 z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
          Care<span className="text-purple-300">BridgeAI</span>
        </h1>
        
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-4 rounded-full"></div>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed backdrop-blur-sm">
          CareBridgeAI is an AI-powered support platform that{" "}
          <span className="font-semibold text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
            connects refugees, donors, and NGOs
          </span>
          . Our mission is to provide refugees with vital resources, 
          help donors make meaningful contributions, and empower NGOs 
          to reach those who need them most.
        </p>
        <div className="flex justify-center items-center gap-2 mt-3 text-slate-400">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          <span className="text-2xl">🌍</span>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          <span className="text-2xl">💙</span>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-400"></div>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center z-10">
        {/* Mic Button */}
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-ping opacity-20"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-ping opacity-30 delay-1000"></div>
          
          <button className="relative p-6 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/10 group">
            <Mic size={32} className="drop-shadow-lg group-hover:animate-pulse" />
          </button>
        </div>
        
        <p className="mt-6 mb-1 text-slate-400 text-sm animate-fade-in">
          Tap to speak with CareBridgeAI
        </p>
      </main>

      {/* Emergency Button */}
      <div className="relative flex justify-center mb-6 z-10">
        <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-red-400/20 group">
          <Phone size={20} className="group-hover:animate-bounce" />
          <span className="tracking-wide">Emergency Call</span>
        </button>
      </div>

      <footer className="relative w-full bg-black/40 backdrop-blur-xl border-t border-white/10 p-5 z-10">
      <p className="block text-slate-300 mb-3 font-medium text-sm uppercase tracking-wider">
        Select your role:
      </p>

      <div className="flex justify-around gap-3">
        {/* Refugees Button */}
        <button
          onClick={() => handleSelect("refugees")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 
            ${role === "refugees" 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/70"}`}
        >
          🏠 Refugees
        </button>

        {/* Donators Button */}
        <button
          onClick={() => handleSelect("donors")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 
            ${role === "donators" 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/70"}`}
        >
          💝 Donors
        </button>

        {/* NGOs Button */}
        <button
          onClick={() => handleSelect("ngos")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 
            ${role === "ngos" 
              ? "bg-purple-600 text-white shadow-lg" 
              : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/70"}`}
        >
          🏢 NGOs
        </button>
      </div>
    </footer>
    </div>
  )
}

export default Main