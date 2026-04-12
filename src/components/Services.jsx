import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Heart, Users, Building2, Globe, Zap, Shield, MessageSquare, BarChart3, MapPin, Mic, ArrowRight, CheckCircle, Activity, Sparkles, FileText, Handshake } from "lucide-react";

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND (mirrors Main page exactly)
───────────────────────────────────────────── */
function AmbientBackground({ isLightMode }) {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 ${isLightMode ? 'bg-slate-50' : 'bg-[#020617]'}`}>
      <div
        className={`absolute inset-0 ${isLightMode ? 'opacity-[0.08]' : 'opacity-[0.04]'}`}
        style={{
          backgroundImage: `radial-gradient(${isLightMode ? '#0f172a' : '#ffffff'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className={`absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[160px] ${isLightMode ? 'bg-cyan-300/20' : 'bg-cyan-500/10'}`} />
      <div className={`absolute top-20 right-[-200px] w-[500px] h-[500px] rounded-full blur-[150px] ${isLightMode ? 'bg-cyan-200/15' : 'bg-cyan-400/8'}`} />
      <div className={`absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] ${isLightMode ? 'bg-cyan-200/25' : 'bg-cyan-400/8'}`} />

      <div className="absolute inset-0">
        {[
          { size: 96,  left: '10%', delay: '0s'  },
          { size: 64,  left: '25%', delay: '3s'  },
          { size: 128, left: '50%', delay: '6s'  },
          { size: 80,  left: '70%', delay: '2s'  },
          { size: 112, left: '85%', delay: '8s'  },
        ].map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${isLightMode ? 'opacity-40' : 'opacity-25'}`}
            style={{
              width: b.size, height: b.size, left: b.left, bottom: -180,
              background: 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.4), rgba(34,211,238,0.05))',
              filter: 'blur(2px)',
              animation: `floatUp 18s ${b.delay} infinite linear`,
            }}
          />
        ))}
      </div>

      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05),transparent_70%)] ${isLightMode ? 'opacity-50' : ''}`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${isLightMode ? 'from-white/20 via-slate-50/60 to-slate-50' : 'from-black/20 via-[#020617]/80 to-[#020617]'}`} />

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);      opacity: 0.3; }
          50%  { opacity: 0.5; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0;   }
        }
        @keyframes slideUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scanLine { 0% { top:0%; } 100% { top:100%; } }
        .anim-slide-up { animation: slideUp 0.65s ease both; }
        .anim-fade-in  { animation: fadeIn  0.4s  ease both; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PULSE RINGS
───────────────────────────────────────────── */
function PulseRings({ isLightMode, sm = false }) {
  const s = sm ? ['w-14 h-14', 'w-20 h-20', 'w-28 h-28'] : ['w-20 h-20', 'w-32 h-32', 'w-44 h-44'];
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`absolute ${s[0]} rounded-full animate-ping [animation-duration:3s] ${isLightMode ? 'bg-cyan-400/25' : 'bg-cyan-400/15'}`} />
      <div className={`absolute ${s[1]} rounded-full border animate-pulse [animation-duration:4s] ${isLightMode ? 'border-cyan-500/35' : 'border-cyan-400/25'}`} />
      <div className={`absolute ${s[2]} rounded-full border animate-pulse [animation-duration:5s] ${isLightMode ? 'border-cyan-600/15' : 'border-cyan-500/10'}`} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   SERVICE CARD (large feature card)
───────────────────────────────────────────── */
function ServiceFeatureCard({ icon: Icon, title, description, features, index, isLightMode }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl p-6 border backdrop-blur-xl transition-all duration-700 overflow-hidden
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/60 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(8,145,178,0.07)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/25 hover:shadow-[0_4px_20px_rgba(34,211,238,0.06)]'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Hover glow */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLightMode ? 'bg-cyan-200/40' : 'bg-cyan-500/10'}`} />
      {/* Bottom shimmer */}
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className="relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110
          ${isLightMode ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'}`}>
          <Icon size={18} />
        </div>
        <h3 className={`font-bold text-base mb-2 transition-colors duration-300
          ${isLightMode ? 'text-slate-800 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'}`}>
          {title}
        </h3>
        <p className={`text-sm leading-relaxed mb-4 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {description}
        </p>

        {/* Feature bullets */}
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={11} className={isLightMode ? 'text-cyan-500 shrink-0' : 'text-cyan-600 shrink-0'} />
              <span className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPACT CAPABILITY CARD
───────────────────────────────────────────── */
function CapabilityCard({ icon: Icon, title, description, index, isLightMode }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl p-5 border backdrop-blur-xl transition-all duration-700 overflow-hidden cursor-default
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/55 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(8,145,178,0.07)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/25 hover:shadow-[0_4px_20px_rgba(34,211,238,0.06)]'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300
        ${isLightMode ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'}`}>
        <Icon size={14} />
      </div>

      <h3 className={`font-bold text-sm mb-2 transition-colors duration-300
        ${isLightMode ? 'text-slate-800 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'}`}>
        {title}
      </h3>
      <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
        {description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SERVICES PAGE
───────────────────────────────────────────── */
const Services = ({ isLightMode = false }) => {
  const [heroRef, heroInView] = useInView(0.05);

  const coreServices = [
    {
      icon: Heart,
      title: "Refugee Assistance",
      description: "Comprehensive AI-powered support system connecting refugees with essential resources, emergency services, and safe relocation paths.",
      features: [
        "Real-time shelter and aid location",
        "Multilingual AI chatbot support",
        "Emergency SOS and ambulance dispatch",
        "Legal guidance and documentation help"
      ]
    },
    {
      icon: Briefcase,
      title: "Donor Support Platform",
      description: "Enable donors to contribute securely and directly to verified causes with full transparency, impact tracking, and tax-deductible receipts.",
      features: [
        "Secure one-time and recurring donations",
        "Real-time impact dashboards",
        "Tax deduction certificates",
        "Donor-to-beneficiary matching"
      ]
    },
    {
      icon: Building2,
      title: "NGO Collaboration Hub",
      description: "Empower NGOs with data insights, volunteer coordination, and AI-assisted donor partnerships to maximize humanitarian impact.",
      features: [
        "Fundraising campaign management",
        "Volunteer and resource coordination",
        "AI-powered analytics dashboard",
        "Cross-organization collaboration tools"
      ]
    },
  ];

  const capabilities = [
    { icon: Zap,           title: "AI Medical Assistant",     description: "Symptom analysis powered by vector search across medical case databases for instant preliminary guidance." },
    { icon: MapPin,        title: "Hospital Locator",         description: "GPS-driven hospital and clinic finder using OpenStreetMap with real-time distance and route directions." },
    { icon: Mic,           title: "Voice Recognition",        description: "Speak naturally in any language — our speech-to-text AI transcribes and translates in real time." },
    { icon: MessageSquare, title: "Multilingual Chatbot",     description: "AI chat assistant supporting 50+ languages, providing aid information, medical guidance, and emotional support." },
    { icon: Shield,        title: "Verified NGO Network",     description: "Every partner organization undergoes thorough verification ensuring transparency and accountability." },
    { icon: BarChart3,     title: "Impact Analytics",         description: "Real-time dashboards tracking donations, beneficiaries reached, and campaign performance across all programs." },
    { icon: FileText,      title: "Document Assistance",      description: "AI-guided help with asylum applications, legal documents, and government forms in multiple languages." },
    { icon: Globe,         title: "Global Coverage",          description: "Active in 34 countries with localized support, culturally-aware AI, and region-specific resource databases." },
  ];

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans transition-colors duration-700 selection:bg-cyan-500/30 ${isLightMode ? 'bg-slate-50 text-slate-800' : 'bg-[#020617] text-slate-300'}`}>
      <AmbientBackground isLightMode={isLightMode} />

      <div className="relative z-10">

        {/* ── HERO ── */}
        <section ref={heroRef} className="min-h-screen flex items-center px-6 pt-20 pb-12">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_370px] gap-14 items-center">

            {/* LEFT */}
            <div>
              {/* Live badge */}
              <div
                className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.05)] mb-8
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}
                  ${isLightMode ? 'bg-white/80 border-cyan-200' : 'bg-slate-900/50 border-cyan-500/20'}`}
                style={{ animationDelay: '0ms' }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>Platform:</span>
                <span className={`text-sm font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>AI-powered humanitarian solutions</span>
              </div>

              {/* Headline */}
              <h1
                className={`text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.88] mb-6
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '80ms' }}
              >
                <span className={`block bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  Connect, Aid
                </span>
                <span className={`bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  &amp; Empower.
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-md font-light mb-10
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}
                  ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}
                style={{ animationDelay: '160ms' }}
              >
                CareBridgeAI provides{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-900' : 'text-white'}`}>AI-powered solutions</span>{' '}
                and support systems that bridge the gap between{' '}
                <span className={`font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-100'}`}>refugees</span>,{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>donors</span>, and{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>NGOs</span>.
              </p>

              {/* Quick stat pills */}
              <div
                className={`flex flex-wrap gap-3 ${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '240ms' }}
              >
                {[
                  { label: '3 Core Services', icon: Sparkles },
                  { label: '8 AI Capabilities', icon: Zap },
                  { label: '50+ Languages', icon: Globe },
                ].map((pill, i) => (
                  <div key={i} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-xs font-semibold
                    ${isLightMode
                      ? 'bg-white/60 border-cyan-200/60 text-cyan-700'
                      : 'bg-slate-800/40 border-cyan-500/15 text-cyan-400'
                    }`}>
                    <pill.icon size={12} />
                    {pill.label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Feature showcase card */}
            <div
              className={`${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '100ms' }}
            >
              <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl
                ${isLightMode
                  ? 'bg-white/60 border-black/5 shadow-[0_0_40px_rgba(8,145,178,0.06)]'
                  : 'bg-slate-900/50 border-cyan-500/15 shadow-[0_0_40px_rgba(34,211,238,0.05)]'
                }`}>
                <div className={`absolute top-0 left-0 right-0 h-px ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent'}`} />
                <div
                  className={`absolute left-0 right-0 h-px z-10 pointer-events-none ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-400/12 to-transparent'}`}
                  style={{ animation: 'scanLine 5s linear infinite' }}
                />

                <div className="p-7">
                  <div className="text-center mb-6">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <PulseRings isLightMode={isLightMode} />
                      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500
                        ${isLightMode
                          ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] text-cyan-600'
                          : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-cyan-400'
                        }`}>
                        <Sparkles size={24} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      </div>
                    </div>
                    <h2 className={`text-lg font-bold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>How It Works</h2>
                    <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>The CareBridgeAI ecosystem</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { step: "01", label: "Identify", desc: "AI analyzes needs — medical, shelter, legal, or emotional support." },
                      { step: "02", label: "Match", desc: "Intelligent matching connects resources with those who need them most." },
                      { step: "03", label: "Deliver", desc: "NGOs and donors coordinate aid delivery with real-time tracking." },
                      { step: "04", label: "Measure", desc: "Impact analytics ensure transparency and continuous improvement." },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 rounded-xl p-3 border transition-colors
                        ${isLightMode
                          ? 'bg-white/80 border-slate-100 hover:border-cyan-200'
                          : 'bg-slate-800/40 border-white/5 hover:border-cyan-500/20'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold
                          ${isLightMode ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {item.step}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${isLightMode ? 'text-slate-700' : 'text-white'}`}>{item.label}</p>
                          <p className={`text-[11px] leading-snug ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust row */}
                  <div className={`flex justify-center gap-3 mt-5 text-[10px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {['End-to-End', 'AI-Driven', 'Transparent'].map((t, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <CheckCircle size={9} className={isLightMode ? 'text-cyan-500' : 'text-cyan-600'} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE SERVICES ── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>What we offer</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Core Services</h2>
              </div>
              <p className={`text-xs hidden md:block text-right max-w-[200px] ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Three pillars of humanitarian support
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {coreServices.map((s, i) => (
                <ServiceFeatureCard key={i} {...s} index={i} isLightMode={isLightMode} />
              ))}
            </div>
          </div>
        </section>

        {/* ── AI CAPABILITIES ── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>Powered by AI</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Platform Capabilities</h2>
              </div>
              <p className={`text-xs hidden md:block text-right max-w-[200px] ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Advanced AI tools for maximum impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {capabilities.map((c, i) => (
                <CapabilityCard key={i} {...c} index={i} isLightMode={isLightMode} />
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CAREBRIDGE CTA ── */}
        <section className="py-12 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className={`rounded-3xl border overflow-hidden relative backdrop-blur-xl
              ${isLightMode
                ? 'bg-white/60 border-black/5 shadow-[0_0_30px_rgba(8,145,178,0.05)]'
                : 'bg-slate-900/40 border-cyan-500/12 shadow-[0_0_30px_rgba(34,211,238,0.04)]'
              }`}>

              <div className={`absolute top-0 left-0 right-0 h-px ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${isLightMode ? 'bg-cyan-200/25' : 'bg-cyan-500/5'}`} />

              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">

                <div className="flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>Why CareBridgeAI?</p>
                  <h3 className={`text-2xl font-extrabold tracking-tight mb-3 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                    Technology That Saves Lives
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-md ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    With AI-driven insights, multilingual chatbots, real-time hospital locators, and direct emergency support — CareBridgeAI ensures no one is left behind.
                  </p>
                  <div className={`flex gap-5 mt-4 text-[11px] font-semibold ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {['50+ Languages', '24/7 AI Support', '94% Accuracy'].map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle size={10} className={isLightMode ? 'text-cyan-500' : 'text-cyan-600'} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`hidden md:block w-px self-stretch ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`} />

                <div className="md:w-56 flex flex-col items-center text-center gap-4">
                  <div className="relative w-14 h-14">
                    <PulseRings isLightMode={isLightMode} sm />
                    <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border
                      ${isLightMode
                        ? 'bg-white border-cyan-300 shadow-[0_0_30px_rgba(8,145,178,0.15)] text-cyan-600'
                        : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] text-cyan-400'
                      }`}>
                      <Handshake size={20} strokeWidth={1.5} className="drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                    </div>
                  </div>
                  <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group outline-none hover:scale-[1.02] active:scale-[0.98]
                    ${isLightMode
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.3)]'
                      : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:border-cyan-400'
                    }`}>
                    Get Started
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <p className={`text-[10px] ${isLightMode ? 'text-slate-400' : 'text-slate-600'}`}>Free for refugees · Transparent for donors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 pb-10 opacity-60">
          <Activity size={13} className={isLightMode ? 'text-cyan-600' : 'text-cyan-500'} />
          <p className={`text-xs font-medium tracking-wide ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
            CareBridgeAI © {new Date().getFullYear()} — Empowering Humanitarian Aid
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
