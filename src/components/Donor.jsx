import React, { useState, useEffect, useRef } from 'react';
import { Heart, DollarSign, Users, Globe, ArrowRight, CheckCircle, Star, TrendingUp, Activity } from "lucide-react";

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND (mirrors Main page exactly)
───────────────────────────────────────────── */
function AmbientBackground({ isLightMode }) {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 ${isLightMode ? 'bg-slate-50' : 'bg-[#020617]'}`}>
      {/* Dot grid */}
      <div
        className={`absolute inset-0 ${isLightMode ? 'opacity-[0.08]' : 'opacity-[0.04]'}`}
        style={{
          backgroundImage: `radial-gradient(${isLightMode ? '#0f172a' : '#ffffff'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Cyan glow blobs */}
      <div className={`absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[160px] ${isLightMode ? 'bg-cyan-300/20' : 'bg-cyan-500/10'}`} />
      <div className={`absolute top-20 right-[-200px] w-[500px] h-[500px] rounded-full blur-[150px] ${isLightMode ? 'bg-cyan-200/15' : 'bg-cyan-400/8'}`} />
      <div className={`absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] ${isLightMode ? 'bg-cyan-200/25' : 'bg-cyan-400/8'}`} />

      {/* Floating Bubbles */}
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
   PULSE RINGS (same as Main)
───────────────────────────────────────────── */
function PulseRings({ isLightMode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`absolute w-20 h-20 rounded-full animate-ping [animation-duration:3s] ${isLightMode ? 'bg-cyan-400/25' : 'bg-cyan-400/15'}`} />
      <div className={`absolute w-32 h-32 rounded-full border animate-pulse [animation-duration:4s] ${isLightMode ? 'border-cyan-500/35' : 'border-cyan-400/25'}`} />
      <div className={`absolute w-44 h-44 rounded-full border animate-pulse [animation-duration:5s] ${isLightMode ? 'border-cyan-600/15' : 'border-cyan-500/10'}`} />
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
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[\d,]/g, '');
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
function StatCard({ icon: Icon, label, value, isLightMode, delay }) {
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

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300
        ${isLightMode
          ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100'
          : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'
        }`}>
        <Icon size={15} />
      </div>
      <div className={`text-xl font-bold tabular-nums tracking-tight mb-0.5 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{count}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAUSE CARD
───────────────────────────────────────────── */
function CauseCard({ cause, index, isLightMode }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl p-5 border backdrop-blur-xl transition-all duration-700 overflow-hidden
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${isLightMode
          ? 'bg-white/60 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(8,145,178,0.07)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/25 hover:shadow-[0_4px_20px_rgba(34,211,238,0.06)]'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Bottom shimmer on hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isLightMode ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
          <Heart size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{cause.title}</div>
          <div className={`text-[11px] truncate ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>{cause.description}</div>
        </div>
        <span className={`text-xs font-bold tabular-nums shrink-0 ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>{cause.progress}%</span>
      </div>

      <div className={`h-1 rounded-full overflow-hidden ${isLightMode ? 'bg-slate-100' : 'bg-slate-800'}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${isLightMode ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' : 'bg-gradient-to-r from-cyan-500 to-cyan-300'}`}
          style={{ width: inView ? `${cause.progress}%` : '0%' }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DONATION CARD
───────────────────────────────────────────── */
function DonationCard({ isLightMode }) {
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [donationType, setDonationType] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);

  const amounts = ['10', '25', '50', '100', '250', 'custom'];

  return (
    <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl
      ${isLightMode
        ? 'bg-white/60 border-black/5 shadow-[0_0_40px_rgba(8,145,178,0.06)]'
        : 'bg-slate-900/50 border-cyan-500/15 shadow-[0_0_40px_rgba(34,211,238,0.05)]'
      }`}>

      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent'}`} />
      {/* Scan line */}
      <div
        className={`absolute left-0 right-0 h-px z-10 pointer-events-none ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-400/12 to-transparent'}`}
        style={{ animation: 'scanLine 5s linear infinite' }}
      />

      <div className="p-7">
        {/* Icon header with pulse rings */}
        <div className="text-center mb-7">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <PulseRings isLightMode={isLightMode} />
            <button
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 outline-none hover:scale-105
                ${isLightMode
                  ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] hover:shadow-[0_0_60px_rgba(8,145,178,0.25)] text-cyan-600 hover:border-cyan-500'
                  : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)] text-cyan-400 hover:border-cyan-400'
                }`}
            >
              <Heart size={24} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </button>
          </div>
          <h2 className={`text-lg font-bold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Start Your Impact</h2>
          <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>Choose amount &amp; frequency</p>
        </div>

        {/* Toggle */}
        <div className={`flex rounded-xl p-1 mb-5 ${isLightMode ? 'bg-slate-100/80' : 'bg-slate-800/60'}`}>
          {['one-time', 'monthly'].map((t) => (
            <button
              key={t}
              onClick={() => setDonationType(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize tracking-wide transition-all duration-300
                ${donationType === t
                  ? isLightMode
                    ? 'bg-white text-cyan-700 shadow-sm border border-cyan-200/60'
                    : 'bg-slate-700/80 text-cyan-300 shadow-sm border border-cyan-500/20'
                  : isLightMode ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Amount grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {amounts.map((amount) => {
            const sel = selectedAmount === amount;
            return (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-[1.03] active:scale-95
                  ${sel
                    ? isLightMode
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-700 shadow-[0_0_15px_rgba(8,145,178,0.15)]'
                      : 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.12)]'
                    : isLightMode
                      ? 'bg-white/80 border-black/8 text-slate-500 hover:border-cyan-300 hover:text-cyan-600'
                      : 'bg-slate-800/40 border-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
                  }`}
              >
                {amount === 'custom' ? 'Custom' : `$${amount}`}
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        {selectedAmount === 'custom' && (
          <div className={`mb-4 anim-fade-in flex items-center rounded-xl border px-3 py-2.5 transition-colors
            ${isLightMode
              ? 'bg-white border-slate-200 focus-within:border-cyan-400'
              : 'bg-slate-800/60 border-white/5 focus-within:border-cyan-500/50'
            }`}>
            <span className={`text-sm mr-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>$</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className={`flex-1 text-sm bg-transparent outline-none ${isLightMode ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-slate-600'}`}
            />
          </div>
        )}

        {/* CTA — cyan button matching Main's mic button aesthetic */}
        <button
          onClick={() => { setDonated(true); setTimeout(() => setDonated(false), 2800); }}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2
            ${donated
              ? 'bg-emerald-500 text-white'
              : isLightMode
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.25)] hover:shadow-[0_0_40px_rgba(8,145,178,0.35)] hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.12)] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)] hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-xl" />
          <span className="relative flex items-center gap-2">
            {donated
              ? <><CheckCircle size={15} /> Donated! Thank you ♥</>
              : <>
                  <DollarSign size={15} />
                  Donate {selectedAmount !== 'custom' ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ''} {donationType === 'monthly' ? 'Monthly' : 'Now'}
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </>
            }
          </span>
        </button>

        {/* Trust row */}
        <div className={`flex justify-center gap-3 mt-4 text-[10px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {['100% Secure', 'Tax Deductible', 'Direct Impact'].map((t, i) => (
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
   MAIN DONOR PAGE
───────────────────────────────────────────── */
const Donor = ({ isLightMode = false }) => {
  const [heroRef, heroInView] = useInView(0.05);

  const impactStats = [
    { icon: Users,      label: "Lives Impacted",   value: "12,847" },
    { icon: Globe,      label: "Countries Served",  value: "23"     },
    { icon: Heart,      label: "Active Donors",     value: "3,256"  },
    { icon: TrendingUp, label: "Success Rate",      value: "94%"    },
  ];

  const causes = [
    { title: "Emergency Relief",   description: "Immediate aid for crisis situations",  progress: 78 },
    { title: "Education Support",  description: "Learning resources and scholarships",  progress: 65 },
    { title: "Healthcare Access",  description: "Medical care and supplies",            progress: 89 },
    { title: "Housing Assistance", description: "Shelter and accommodation support",    progress: 45 },
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
              {/* Live badge — mirrors Main page */}
              <div
                className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.05)] mb-8
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}
                  ${isLightMode
                    ? 'bg-white/80 border-cyan-200'
                    : 'bg-slate-900/50 border-cyan-500/20'
                  }`}
                style={{ animationDelay: '0ms' }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>Live:</span>
                <span className={`text-sm font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>12,847 lives impacted worldwide</span>
              </div>

              {/* Headline — same gradient logic as Main's CareBridgeAI */}
              <h1
                className={`text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.88] mb-6
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '80ms' }}
              >
                <span className={`block bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  Give, Fund &amp;
                </span>
                <span className={` bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                  Create Impact.
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-md font-light mb-10
                  ${heroInView ? 'anim-slide-up' : 'opacity-0'}
                  ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}
                style={{ animationDelay: '160ms' }}
              >
                An AI-powered bridge connecting{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-900' : 'text-white'}`}>refugees</span>,{' '}
                <span className={`font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-100'}`}>donors</span>, and{' '}
                <span className={`font-medium ${isLightMode ? 'text-slate-800' : 'text-slate-200'}`}>NGOs</span>.
                Every contribution creates ripples of hope.
              </p>

              {/* 2×2 Stats */}
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                {impactStats.map((s, i) => (
                  <StatCard key={i} {...s} isLightMode={isLightMode} delay={220 + i * 60} />
                ))}
              </div>
            </div>

            {/* RIGHT: Donation card */}
            <div
              className={`${heroInView ? 'anim-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '100ms' }}
            >
              <DonationCard isLightMode={isLightMode} />
            </div>
          </div>
        </section>

        {/* ── ACTIVE CAUSES ── */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>Where it goes</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Active Causes</h2>
              </div>
              <p className={`text-xs hidden md:block text-right max-w-[180px] ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-time impact across regions
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {causes.map((cause, i) => (
                <CauseCard key={i} cause={cause} index={i} isLightMode={isLightMode} />
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ── */}
        <section className="py-12 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className={`rounded-3xl border overflow-hidden relative backdrop-blur-xl
              ${isLightMode
                ? 'bg-white/60 border-black/5 shadow-[0_0_30px_rgba(8,145,178,0.05)]'
                : 'bg-slate-900/40 border-cyan-500/12 shadow-[0_0_30px_rgba(34,211,238,0.04)]'
              }`}>

              <div className={`absolute top-0 left-0 right-0 h-px ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${isLightMode ? 'bg-cyan-200/25' : 'bg-cyan-500/5'}`} />
              <div className={`absolute bottom-0 left-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none ${isLightMode ? 'bg-cyan-100/25' : 'bg-cyan-500/4'}`} />

              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">

                {/* Quote */}
                <div className="flex-1">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <blockquote className={`text-base leading-relaxed font-light italic mb-4 ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                    "CareBridgeAI has revolutionized how I connect with causes I care about. The transparency and direct impact reporting gives me confidence that my donations are truly making a difference."
                  </blockquote>
                  <p className={`text-sm font-bold ${isLightMode ? 'text-slate-700' : 'text-white'}`}>
                    Sarah K. <span className={`font-normal ml-1 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>— Monthly Donor</span>
                  </p>
                </div>

                <div className={`hidden md:block w-px self-stretch ${isLightMode ? 'bg-black/5' : 'bg-white/5'}`} />

                {/* Right CTA — mirrors Main's mic button section */}
                <div className="md:w-56 flex flex-col items-center text-center gap-4">
                  <div className="relative w-16 h-16">
                    <PulseRings isLightMode={isLightMode} />
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500
                      ${isLightMode
                        ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] text-cyan-600'
                        : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-cyan-400'
                      }`}>
                      <Heart size={22} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-extrabold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Trusted by Thousands</h3>
                    <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>3,256+ active donors worldwide</p>
                  </div>
                  <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group outline-none hover:scale-[1.02] active:scale-[0.98]
                    ${isLightMode
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.3)]'
                      : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:border-cyan-400'
                    }`}>
                    Join Us
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer — same as Main */}
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

export default Donor;