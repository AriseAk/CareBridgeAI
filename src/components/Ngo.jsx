import React from 'react'
import { Building2, Users, Globe, TrendingUp, ArrowRight, CheckCircle, Zap, Shield, Handshake, BarChart3, MessageSquare, FileText } from "lucide-react";
import { useState } from "react";

const Ngo = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const platformStats = [
    { icon: Building2, label: "Partner NGOs", value: "147", color: "from-cyan-400 to-blue-500" },
    { icon: Globe, label: "Global Reach", value: "34", suffix: " countries", color: "from-purple-400 to-pink-500" },
    { icon: Users, label: "Beneficiaries", value: "25K+", color: "from-pink-400 to-red-500" },
    { icon: TrendingUp, label: "Success Rate", value: "96%", color: "from-green-400 to-emerald-500" }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Chatting",
      description: "Leverage advanced AI to provide instant support, answer queries, and guide refugees to essential services around the clock."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track your impact, donor engagement, and campaign performance with comprehensive dashboards and reporting tools."
    },
    {
      icon: Shield,
      title: "Verified Platform",
      description: "All NGOs undergo thorough verification processes ensuring transparency, accountability, and trust for donors."
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Build meaningful relationships with donors through our integrated communication platform and impact sharing tools."
    }
  ];

  const services = [
    {
      title: "Fundraising Campaigns",
      description: "Create compelling campaigns with multimedia content, progress tracking, and automated donor updates."
    },
    {
      title: "Donor Management",
      description: "Comprehensive donor relationship management with engagement analytics and personalized communication tools."
    },
    {
      title: "Impact Reporting",
      description: "Generate detailed impact reports with data visualization to showcase your organization's achievements."
    },
    {
      title: "Resource Matching",
      description: "AI-driven matching system connects your needs with available resources from donors and partner organizations."
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
              <Building2 size={20} className="text-cyan-400" />
              <span className="text-slate-300 font-medium">For NGOs & Organizations</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              Amplify Your Impact with<br />
              <span className="text-4xl md:text-5xl">AI-Powered Solutions</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Join a network of verified NGOs using advanced AI to connect with donors, 
              manage resources, and maximize their humanitarian impact across the globe.
            </p>

           
            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {platformStats.map((stat, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}{stat.suffix}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Powerful Features for NGOs
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Everything you need to scale your impact and connect with supporters worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Comprehensive Services
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                End-to-end solutions designed specifically for humanitarian organizations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-slate-300 mb-6">{service.description}</p> 
                </div>
              ))}
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}

export default Ngo