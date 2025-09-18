import React from 'react'

const Services = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Our <span className="text-purple-300">Services</span>
        </h1>
        <p className="text-lg text-slate-300 mb-12 leading-relaxed">
          CareBridgeAI provides AI-powered solutions and support systems that
          bridge the gap between refugees, donors, and NGOs — ensuring faster
          aid, efficient coordination, and meaningful connections.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Refugee Support */}
        <div className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <div className="text-4xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">
            Refugee Assistance
          </h2>
          <p className="text-slate-300">
            Access essential services such as shelter, healthcare, and
            educational opportunities with real-time guidance.
          </p>
        </div>

        {/* Donor Services */}
        <div className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <div className="text-4xl mb-4">💝</div>
          <h2 className="text-2xl font-semibold text-pink-400 mb-3">
            Donor Support
          </h2>
          <p className="text-slate-300">
            Enable donors to contribute securely and directly to verified
            causes, ensuring transparency and impact.
          </p>
        </div>

        {/* NGO Services */}
        <div className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-700 hover:scale-105 transition-transform">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">
            NGO Collaboration
          </h2>
          <p className="text-slate-300">
            Empower NGOs with data insights, volunteer coordination, and donor
            partnerships to maximize humanitarian impact.
          </p>
        </div>
      </div>

      {/* Extra Feature Section */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          🌍 Why Choose CareBridgeAI?
        </h2>
        <p className="text-slate-400 mb-6">
          With AI-driven insights, multilingual chatbots, and direct emergency
          support, CareBridgeAI ensures no one is left behind.
        </p>
        <button
          onClick={() => alert("Contact page coming soon!")}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md text-white font-semibold hover:scale-105 transition-transform"
        >
          📩 Contact Us
        </button>
      </div>
    </div>
    </div>
  )
}

export default Services
