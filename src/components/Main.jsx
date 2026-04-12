import { useState, useEffect } from "react";
import { Mic, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND + FLOATING BUBBLES
───────────────────────────────────────────── */
function AmbientBackground({ isLightMode }) {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 ${isLightMode ? 'bg-slate-50' : 'bg-[#020617]'}`}>
      <div
        className={`absolute inset-0 ${isLightMode ? 'opacity-[0.08]' : 'opacity-[0.04]'}`}
        style={{
          backgroundImage: `radial-gradient(${isLightMode ? '#0f172a' : '#ffffff'} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className={`absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[160px] ${isLightMode ? 'bg-cyan-300/20' : 'bg-cyan-500/10'}`} />
      <div className={`absolute top-20 right-[-200px] w-[500px] h-[500px] rounded-full blur-[150px] ${isLightMode ? 'bg-purple-300/20' : 'bg-purple-500/10'}`} />
      <div className={`absolute bottom-[-100px] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] ${isLightMode ? 'bg-cyan-200/30' : 'bg-cyan-400/10'}`} />

      {/* Floating Bubbles */}
      <div className="absolute inset-0">
        <div className={`bubble w-24 h-24 left-[10%] bottom-[-120px] ${isLightMode ? 'opacity-50' : ''}`} />
        <div className={`bubble w-16 h-16 left-[25%] bottom-[-150px] ${isLightMode ? 'opacity-50' : ''}`} />
        <div className={`bubble w-32 h-32 left-[50%] bottom-[-180px] ${isLightMode ? 'opacity-50' : ''}`} />
        <div className={`bubble w-20 h-20 left-[70%] bottom-[-140px] ${isLightMode ? 'opacity-50' : ''}`} />
        <div className={`bubble w-28 h-28 left-[85%] bottom-[-200px] ${isLightMode ? 'opacity-50' : ''}`} />
      </div>

      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05),transparent_70%)] ${isLightMode ? 'opacity-50' : ''}`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${isLightMode ? 'from-white/20 via-slate-50/80 to-slate-50' : 'from-black/20 via-[#020617]/80 to-[#020617]'}`} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ENHANCED PULSE RINGS
───────────────────────────────────────────── */
function PulseRings({ isLightMode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`absolute w-28 h-28 rounded-full animate-ping [animation-duration:3s] ${isLightMode ? 'bg-cyan-400/30' : 'bg-cyan-400/20'}`} />
      <div className={`absolute w-40 h-40 rounded-full border animate-pulse [animation-duration:4s] ${isLightMode ? 'border-cyan-500/40' : 'border-cyan-400/30'}`} />
      <div className={`absolute w-56 h-56 rounded-full border animate-pulse [animation-duration:5s] ${isLightMode ? 'border-cyan-600/20' : 'border-cyan-500/10'}`} />
    </div>
  );
}
/* ─────────────────────────────────────────────
   TYPING TEXT COMPONENT
───────────────────────────────────────────── */
function TypingText({ strings, isLightMode }){
  const [displayed, setDisplayed] = useState("");
  const [strIdx, setStrIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[strIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2500);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setStrIdx((s) => (s + 1) % strings.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? 30 : 50);

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, strIdx, strings]);

  return (
    <span className={`font-medium tracking-wide ${isLightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>
      {displayed}
      <span className={`inline-block w-0.5 h-3.5 ml-1 align-middle animate-pulse ${isLightMode ? 'bg-cyan-600' : 'bg-cyan-400'}`} />
    </span>
  );
}

/* ─────────────────────────────────────────────
   ROLE CARD (REFINED GLASSMORPHISM)
───────────────────────────────────────────── */
function RoleCard({ emoji, label, sub, onClick, active, isLightMode }) {
  const activeClasses = isLightMode
    ? "bg-gradient-to-b from-cyan-100 to-transparent border-t border-cyan-400/50 shadow-[0_-5px_30px_rgba(8,145,178,0.15)] -translate-y-1"
    : "bg-gradient-to-b from-cyan-500/15 to-transparent border-t border-cyan-400/50 shadow-[0_-5px_30px_rgba(34,211,238,0.15)] -translate-y-1";
    
  const inactiveClasses = isLightMode
    ? "bg-white/60 border-t border-black/5 border-b border-transparent hover:bg-white hover:border-cyan-400/30 hover:-translate-y-1 shadow-sm"
    : "bg-slate-800/20 border-t border-white/5 border-b border-transparent hover:bg-slate-800/40 hover:border-cyan-400/30 hover:-translate-y-1";

  return (
    <button
      onClick={onClick}
      className={`group relative flex-1 min-w-[120px] p-6 rounded-3xl backdrop-blur-xl transition-all duration-500 ease-out cursor-pointer outline-none text-center overflow-hidden ${active ? activeClasses : inactiveClasses}`}
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className={`text-3xl mb-3 transition-transform duration-500 ${active ? "scale-110" : "group-hover:scale-110 group-hover:-translate-y-1"}`}>
          {emoji}
        </div>
        <div className={`font-bold text-sm tracking-wider uppercase mb-1.5 transition-colors duration-300 ${active ? (isLightMode ? "text-cyan-700" : "text-cyan-300") : (isLightMode ? "text-slate-600 group-hover:text-slate-900" : "text-slate-200 group-hover:text-white")}`}>
          {label}
        </div>
        <div className={`text-xs font-medium transition-colors duration-300 ${active ? (isLightMode ? "text-cyan-600" : "text-cyan-400/80") : (isLightMode ? "text-slate-500 group-hover:text-cyan-700" : "text-slate-400 group-hover:text-cyan-300/70")}`}>
          {sub}
        </div>
      </div>
      {active && (
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-t-full shadow-[0_0_10px_rgba(34,211,238,0.8)] ${isLightMode ? 'bg-cyan-500' : 'bg-cyan-400'}`} />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Main = ({ isLightMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`relative max-h-screen flex flex-col justify-between overflow-hidden font-sans transition-colors duration-700 selection:bg-cyan-500/30 ${isLightMode ? 'bg-slate-50 text-slate-800' : 'bg-[#020617] text-slate-300'}`}>
      <AmbientBackground isLightMode={isLightMode} />

      {/* HEADER */}
      <header className="relative z-10 px-6 pt-16 pb-8 text-center max-w-4xl mx-auto w-full">
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-transparent bg-clip-text drop-shadow-sm ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
          CareBridgeAI
        </h1>
        <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
          An AI-powered bridge connecting{" "}
          <span className={`font-medium ${isLightMode ? 'text-slate-900' : 'text-white'}`}>refugees</span>,{" "}
          <span className={`font-medium ${isLightMode ? 'text-cyan-700' : 'text-cyan-100'}`}>donors</span>, and{" "}
          <span className={`font-medium ${isLightMode ? 'text-purple-700' : 'text-purple-100'}`}>NGOs</span>.
        </p>

        {/* Live Stats Pill Badge */}
        <div className={`mt-8 inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.05)] ${isLightMode ? 'bg-white/80 border-cyan-200' : 'bg-slate-900/50 border-cyan-500/20'}`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLightMode ? 'bg-cyan-500' : 'bg-cyan-500'}`}></span>
          </span>
          <span className={`text-sm font-semibold uppercase tracking-wider ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>Live:</span>
          <div className="w-[240px] text-left">
            <TypingText isLightMode={isLightMode} strings={["Assisting 12,000+ refugees", "Processing emergency aid", "Connecting 340 active NGOs", "Real-time vital translation"]} />
          </div>
        </div>
      </header>

      {/* MIC SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 gap-8">
        <div className="relative flex flex-col items-center justify-center group">
          <PulseRings isLightMode={isLightMode} />
          <button
            onClick={() => navigate("/chatbot")}
            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center border transition-all duration-500 outline-none hover:scale-105 ${
              isLightMode 
                ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] hover:shadow-[0_0_60px_rgba(8,145,178,0.25)] hover:border-cyan-500 text-slate-400 hover:text-cyan-600' 
                : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)] hover:border-cyan-400 text-slate-300 hover:text-cyan-300'
            }`}
          >
            <Mic size={36} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </button>
          <p className={`mt-10 text-sm font-bold tracking-[0.25em] uppercase animate-pulse ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>
            Tap to speak
          </p>
        </div>
      </main>

      {/* ROLE CARDS */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <RoleCard isLightMode={isLightMode} emoji="🏠" label="Refugees" sub="Find shelter, aid & support" onClick={() => navigate("/")} active={location.pathname === "/"} />
          <RoleCard isLightMode={isLightMode} emoji="💝" label="Donors" sub="Give, fund & create impact" onClick={() => navigate("/donors")} active={location.pathname === "/donors"} />
          <RoleCard isLightMode={isLightMode} emoji="🏢" label="NGOs" sub="Manage resources & deliver" onClick={() => navigate("/ngos")} active={location.pathname === "/ngos"} />
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 opacity-60">
          <Activity size={14} className={isLightMode ? "text-cyan-600" : "text-cyan-500"} />
          <p className={`text-xs font-medium tracking-wide ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
            CareBridgeAI © {new Date().getFullYear()} — Empowering Humanitarian Aid
          </p>
        </div>
      </footer>

      <style>{`
        .bubble {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, rgba(34,211,238,0.4), rgba(34,211,238,0.05));
          animation: floatUp 18s infinite linear;
          opacity: 0.3;
          filter: blur(2px);
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Main;