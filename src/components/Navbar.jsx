import React from 'react'
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div>
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-slate-900/40 to-cyan-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                Care<span className="text-purple-300">BridgeAI</span>
              </span>
              {/* Brand accent */}
              <div className="ml-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="/" className="relative text-slate-300 hover:text-cyan-400 font-medium transition-all duration-300 group">
                Home
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="/about" className="relative text-slate-300 hover:text-cyan-400 font-medium transition-all duration-300 group">
                About
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="/services" className="relative text-slate-300 hover:text-cyan-400 font-medium transition-all duration-300 group">
                Services
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a href="/hospital" className="relative text-slate-300 hover:text-cyan-400 font-medium transition-all duration-300 group">
                Hospital
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-cyan-400 focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                {isOpen ? <X size={28} className="animate-spin" /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/90 backdrop-blur-xl border-t border-white/5 relative">
            {/* Mobile menu gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-cyan-900/10"></div>
            
            <div className="px-2 pt-2 pb-3 space-y-1 relative z-10">
              <a href="#" className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-gradient-to-r hover:from-cyan-600/20 hover:to-purple-600/20 hover:text-cyan-400 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 transform hover:translate-x-2">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  Home
                </span>
              </a>
              <a href="#about" className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-gradient-to-r hover:from-cyan-600/20 hover:to-purple-600/20 hover:text-cyan-400 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 transform hover:translate-x-2">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  About
                </span>
              </a>
              <a href="#services" className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-gradient-to-r hover:from-cyan-600/20 hover:to-purple-600/20 hover:text-cyan-400 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 transform hover:translate-x-2">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  Services
                </span>
              </a>
              <a href="#contact" className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-gradient-to-r hover:from-cyan-600/20 hover:to-purple-600/20 hover:text-cyan-400 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 transform hover:translate-x-2">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  Hospitals
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar