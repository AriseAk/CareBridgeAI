import React from 'react'

const About = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          About <span className="text-purple-300">CareBridgeAI</span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 leading-relaxed">
          CareBridgeAI is a humanitarian platform built to connect{" "}
          <span className="text-cyan-400 font-medium">refugees</span>,{" "}
          <span className="text-pink-400 font-medium">donors</span>, and{" "}
          <span className="text-purple-400 font-medium">NGOs</span>.  
          Our mission is to provide timely assistance, streamline support, and
          use technology to build a bridge of care for those in need.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold text-cyan-400 mb-3">For Refugees</h2>
          <p className="text-slate-300">
            Access critical resources, emergency services, and connect with NGOs
            for safe relocation and aid.
          </p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold text-pink-400 mb-3">For Donors</h2>
          <p className="text-slate-300">
            Support humanitarian efforts directly by contributing resources,
            funds, or services to those in need.
          </p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold text-purple-400 mb-3">For NGOs</h2>
          <p className="text-slate-300">
            Collaborate with donors and coordinate assistance programs for
            refugees across different regions.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <button
          onClick={() => alert('Emergency call feature coming soon!')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl shadow-md text-white font-semibold hover:scale-105 transition-transform"
        >
          🚑 Call Ambulance
        </button>
      </div>
    </div>
    </div>
  )
}

export default About
