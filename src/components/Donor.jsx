import React from 'react'
import { Heart, DollarSign, Users, Globe, ArrowRight, CheckCircle, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

const Donor = () => {
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [donationType, setDonationType] = useState('one-time');

  const impactStats = [
    { icon: Users, label: "Lives Impacted", value: "12,847", color: "from-cyan-400 to-blue-500" },
    { icon: Globe, label: "Countries Served", value: "23", color: "from-purple-400 to-pink-500" },
    { icon: Heart, label: "Active Donors", value: "3,256", color: "from-pink-400 to-red-500" },
    { icon: TrendingUp, label: "Success Rate", value: "94%", color: "from-green-400 to-emerald-500" }
  ];

  const donationOptions = ['10', '25', '50', '100', '250', 'custom'];
  const causes = [
    { title: "Emergency Relief", description: "Immediate aid for crisis situations", progress: 78 },
    { title: "Education Support", description: "Learning resources and scholarships", progress: 65 },
    { title: "Healthcare Access", description: "Medical care and supplies", progress: 89 },
    { title: "Housing Assistance", description: "Shelter and accommodation support", progress: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-black"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
              <Heart size={20} className="text-pink-400" />
              <span className="text-slate-300 font-medium">Make a Difference</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              Empower Change Through<br />
              <span className="text-4xl md:text-5xl">Compassionate Giving</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Join thousands of donors who are transforming lives worldwide. Every contribution, 
              no matter the size, creates ripples of hope for refugees seeking safety and new beginnings.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {impactStats.map((stat, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Start Your Impact Journey</h2>
                <p className="text-slate-300">Choose your contribution amount and frequency</p>
              </div>

              {/* Donation Type Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-1">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                      donationType === 'one-time' 
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                      donationType === 'monthly' 
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                {donationOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                      selectedAmount === amount
                        ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-cyan-400 text-cyan-400'
                        : 'bg-slate-800/60 border-slate-600/50 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {amount === 'custom' ? 'Custom' : `$${amount}`}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              {selectedAmount === 'custom' && (
                <div className="mb-8">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    className="w-full p-4 bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              )}

              {/* Donate Button */}
              <button className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                <DollarSign size={24} />
                <span>Donate {selectedAmount !== 'custom' ? `$${selectedAmount}` : ''} {donationType === 'monthly' ? 'Monthly' : 'Now'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Active Causes Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Active Causes
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                See where your donations are making the biggest impact right now
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {causes.map((cause, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Heart size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {cause.title}
                      </h3>
                      <p className="text-slate-400">{cause.description}</p>
                    </div>
                  </div>

                  

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Trusted by Thousands</h3>
              <p className="text-slate-300 text-lg mb-8">
                "CarreBridgeAI has revolutionized how I connect with causes I care about. 
                The transparency and direct impact reporting gives me confidence that my donations 
                are truly making a difference."
              </p>
              
              <div className="flex items-center justify-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>Tax Deductible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>Direct Impact</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Donor