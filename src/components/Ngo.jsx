import React, { useState, useEffect, useRef } from 'react';
import { Building2, Users, Globe, TrendingUp, ArrowRight, CheckCircle, Zap, Shield, Handshake, BarChart3, MessageSquare, FileText, Activity } from "lucide-react";

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND (identical to Main/Donor)
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
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
        @keyframes slideUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideLeft { from { opacity:0; transform:translateX(-18px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scanLine { 0% { top:0%; } 100% { top:100%; } }
        .anim-slide-up    { animation: slideUp   0.65s ease both; }
        .anim-slide-left  { animation: slideLeft  0.65s ease both; }
        .anim-slide-right { animation: slideRight 0.65s ease both; }
        .anim-fade-in     { animation: fadeIn     0.5s  ease both; }
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

function useCountUp(target, duration = 1600, active = false) {
  const [val, setVal] = useState('0');
  useEffect(() => {
    if (!active) return;
    const raw = target.replace(/[^0-9.]/g, '');
    if (!raw) { setVal(target); return; }
    const num = parseFloat(raw);
    const suffix = target.replace(/[\d.]/g, '');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * num).toLocaleString() + suffix);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, suffix = '', isLightMode, delay }) {
  const [ref, inView] = useInView();
  const count = useCountUp(value, 1600, inView);

  return (
    <div
      ref={ref}
      className={`relative group rounded-2xl p-5 border backdrop-blur-xl transition-all duration-700 overflow-hidden
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/60 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(8,145,178,0.08)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute -right-3 -bottom-3 w-14 h-14 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLightMode ? 'bg-cyan-300/25' : 'bg-cyan-500/12'}`} />
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300
        ${isLightMode ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'}`}>
        <Icon size={15} />
      </div>
      <div className={`text-xl font-bold tabular-nums tracking-tight mb-0.5 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
        {count}{suffix}
      </div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, index, isLightMode }) {
  const [ref, inView] = useInView();
  const isEven = index % 2 === 0;

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
      {/* Bottom line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className="relative flex gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110
          ${isLightMode ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'}`}>
          <Icon size={18} />
        </div>
        <div>
          <h3 className={`font-bold text-sm mb-2 transition-colors duration-300
            ${isLightMode ? 'text-slate-800 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────── */
function ServiceCard({ title, description, index, isLightMode }) {
  const [ref, inView] = useInView();
  const icons = [FileText, Handshake, BarChart3, Zap];
  const Icon = icons[index % icons.length];

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl p-6 border backdrop-blur-xl transition-all duration-700 overflow-hidden cursor-default
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/55 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(8,145,178,0.07)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/25 hover:shadow-[0_4px_20px_rgba(34,211,238,0.06)]'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
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
   REGISTER CTA CARD
───────────────────────────────────────────── */
function RegisterCard({ isLightMode }) {
  const [ref, inView] = useInView(0.1);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-700
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/60 border-black/5 shadow-[0_0_40px_rgba(8,145,178,0.06)]'
          : 'bg-slate-900/50 border-cyan-500/15 shadow-[0_0_40px_rgba(34,211,238,0.05)]'
        }`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent'}`} />
      {/* Scan line */}
      <div
        className={`absolute left-0 right-0 h-px z-10 pointer-events-none ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-400/12 to-transparent'}`}
        style={{ animation: 'scanLine 5s linear infinite' }}
      />
      {/* Corner glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${isLightMode ? 'bg-cyan-200/25' : 'bg-cyan-500/5'}`} />

      <div className="relative p-7">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <PulseRings isLightMode={isLightMode} />
            <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500
              ${isLightMode
                ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] text-cyan-600'
                : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-cyan-400'
              }`}>
              <Building2 size={24} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
          </div>
          <h2 className={`text-lg font-bold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Register Your NGO</h2>
          <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>Join 147 partner organizations worldwide</p>
        </div>

        {/* Form fields */}
        <div className="space-y-3 mb-5">
          {[
            { label: 'Organization Name', placeholder: 'Your NGO name', type: 'text' },
            { label: 'Contact Email', placeholder: 'contact@yourorg.org', type: 'email' },
            { label: 'Country of Operation', placeholder: 'Primary country', type: 'text' },
          ].map((field, i) => (
            <div key={i}>
              <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors duration-200
                  ${isLightMode
                    ? 'bg-white/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-400'
                    : 'bg-slate-800/60 border-white/5 text-white placeholder-slate-600 focus:border-cyan-500/50'
                  }`}
              />
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => { setSubmitted(true); setTimeout(() => setSubmitted(false), 2800); }}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group outline-none hover:scale-[1.02] active:scale-[0.98]
            ${submitted
              ? 'bg-emerald-500 text-white'
              : isLightMode
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.25)] hover:shadow-[0_0_40px_rgba(8,145,178,0.35)]'
                : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.12)] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)] hover:border-cyan-400'
            }`}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-xl" />
          <span className="relative flex items-center gap-2">
            {submitted
              ? <><CheckCircle size={15} /> Application Submitted!</>
              : <><Building2 size={15} /> Apply for Partnership <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></>
            }
          </span>
        </button>

        {/* Trust row */}
        <div className={`flex justify-center gap-3 mt-4 text-[10px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {['Verified Process', 'Free to Join', 'AI-Powered'].map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <CheckCircle size={9} className={isLightMode ? 'text-cyan-500' : 'text-cyan-600'} />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN NGO PAGE
───────────────────────────────────────────── */
const Ngo = ({ isLightMode = false }) => {
  const [heroRef, heroInView] = useInView(0.05);

  const platformStats = [
    { icon: Building2,  label: "Partner NGOs",   value: "147"  },
    { icon: Globe,      label: "Global Reach",   value: "34",  suffix: " countries" },
    { icon: Users,      label: "Beneficiaries",  value: "25",  suffix: "K+"  },
    { icon: TrendingUp, label: "Success Rate",   value: "96",  suffix: "%" },
  ];

  const features = [
    { icon: Zap,          title: "AI-Powered Chatting",    description: "Leverage advanced AI to provide instant support, answer queries, and guide refugees to essential services around the clock." },
    { icon: BarChart3,    title: "Real-time Analytics",    description: "Track your impact, donor engagement, and campaign performance with comprehensive dashboards and reporting tools." },
    { icon: Shield,       title: "Verified Platform",      description: "All NGOs undergo thorough verification processes ensuring transparency, accountability, and trust for donors." },
    { icon: MessageSquare,title: "Direct Communication",   description: "Build meaningful relationships with donors through our integrated communication platform and impact sharing tools." },
  ];

  const services = [
    { title: "Fundraising Campaigns",  description: "Create compelling campaigns with multimedia content, progress tracking, and automated donor updates." },
    { title: "Donor Management",       description: "Comprehensive donor relationship management with engagement analytics and personalized communication tools." },
    { title: "Impact Reporting",       description: "Generate detailed impact reports with data visualization to showcase your organization's achievements." },
    { title: "Resource Matching",      description: "AI-driven matching system connects your needs with available resources from donors and partner organizations." },
  ];

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans transition-colors duration-700 selection:bg-cyan-500/30 ${isLightMode ? 'bg-slate-50 text-slate-800' : 'bg-[#020617] text-slate-300'}`}>
      <AmbientBackground isLightMode={isLightMode} />

      <div className="relative z-10">

        {/* ── HERO: Split layout ── */}
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
                <span className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>For NGOs:</span>
                <span className={`text-sm font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>147 organizations actively partnered</span>
              </div>

              {/* Headline */}
              <h1
                className={`text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.88] mb-6
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '80ms' }}
              >
                <span className={`block bg-clip-text text-transparent  ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  Manage, Scale
                </span>
                <span className={`block bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  &amp; Deliver.
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-md font-light mb-10
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}
                  ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}
                style={{ animationDelay: '160ms' }}
              >
                Join a network of verified{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-900' : 'text-white'}`}>NGOs</span>{' '}
                using advanced AI to connect with{' '}
                <span className={`font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-100'}`}>donors</span>,
                manage resources, and maximize humanitarian impact worldwide.
              </p>

              {/* 2×2 Stats */}
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                {platformStats.map((s, i) => (
                  <StatCard key={i} {...s} isLightMode={isLightMode} delay={220 + i * 60} />
                ))}
              </div>
            </div>

            {/* RIGHT: Register card */}
            <div
              className={`${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '100ms' }}
            >
              <RegisterCard isLightMode={isLightMode} />
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>What we offer</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Powerful Features</h2>
              </div>
              <p className={`text-xs hidden md:block text-right max-w-[200px] ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Everything you need to scale your impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} index={i} isLightMode={isLightMode} />
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>End-to-end</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Comprehensive Services</h2>
              </div>
              <p className={`text-xs hidden md:block text-right max-w-[200px] ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Designed for humanitarian organizations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {services.map((s, i) => (
                <ServiceCard key={i} {...s} index={i} isLightMode={isLightMode} />
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA STRIP ── */}
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

                {/* Left: text */}
                <div className="flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>Ready to scale?</p>
                  <h3 className={`text-2xl font-extrabold tracking-tight mb-3 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                    Join the CareBridgeAI Network
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-md ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Get access to AI tools, donor connections, and real-time analytics. Verification takes 48–72 hours.
                  </p>
                  <div className={`flex gap-5 mt-4 text-[11px] font-semibold ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {['147 Partner NGOs', '34 Countries', '96% Success Rate'].map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle size={10} className={isLightMode ? 'text-cyan-500' : 'text-cyan-600'} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`hidden md:block w-px self-stretch ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`} />

                {/* Right: CTA */}
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
                  <p className={`text-[10px] ${isLightMode ? 'text-slate-400' : 'text-slate-600'}`}>Free to join · Verified in 48h</p>
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

export default Ngo;