import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, BookOpen, Volume2, StopCircle, MapPin, X, Activity, Bot, User, Loader2, Sparkles } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ─────────────────────────────────────────────
   MAP RECENTER COMPONENT  
───────────────────────────────────────────── */
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

/* ─────────────────────────────────────────────
   CHATBOT PAGE
───────────────────────────────────────────── */
const ChatBot = ({ isLightMode = false }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Chat State
  const [messages, setMessages] = useState([
    {
      text: "Hello! 👋 I am your Medical Assistant. Describe your symptoms, and I'll find similar past cases to help.",
      sender: "bot",
      sources: [],
      lang: 'en'
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Map State
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Get User Location on Load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location access denied")
      );
    }
  }, []);

  // --- API Functions ---
  const handleSpeak = async (text, lang = 'en') => {
    if (!text) return;
    try {
      const response = await fetch(`${API_URL}/api/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!response.ok) throw new Error("TTS Failed");
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      new Audio(audioUrl).play();
    } catch (error) { console.error("TTS Error", error); }
  };

  const fetchNearbyHospitals = async (type) => {
    if (!userLocation) return alert("Please enable location access.");

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: userLocation.lat,
          lng: userLocation.lng,
          type: type
        }),
      });

      const data = await response.json();
      if (data.hospitals && data.hospitals.length > 0) {
        setHospitals(data.hospitals);
        setShowMap(true);
      } else {
        alert(`No ${type}s found nearby.`);
      }
    } catch (error) {
      console.error("Map Error:", error);
      alert("Failed to load hospitals.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        setIsLoading(true);
        try {
          const res = await fetch(`${API_URL}/api/voicesearch`, { method: "POST", body: formData });
          const data = await res.json();
          if (data.transcribed_text) setInput(data.transcribed_text);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.text }),
      });

      if (!response.ok) throw new Error("Chat API failed");
      const data = await response.json();

      const botMessage = {
        text: data.answer,
        sender: "bot",
        sources: data.sources || [],
        lang: data.language || 'en',
        search_type: data.search_type
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "Error connecting to server. Please ensure the backend is running.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className={`flex h-[calc(100vh-100px)] mt-4 w-full overflow-hidden relative font-sans transition-colors duration-700 rounded-t-2xl ${isLightMode ? 'bg-slate-50' : 'bg-[#020617]'}`}>

      {/* Ambient effects (subtle for chat) */}
      <div className={`fixed inset-0 z-0 pointer-events-none ${isLightMode ? 'bg-slate-50' : 'bg-[#020617]'}`}>
        <div
          className={`absolute inset-0 ${isLightMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `radial-gradient(${isLightMode ? '#0f172a' : '#ffffff'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] ${isLightMode ? 'bg-cyan-300/15' : 'bg-cyan-500/8'}`} />
        <div className={`absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] ${isLightMode ? 'bg-cyan-200/15' : 'bg-cyan-400/6'}`} />
      </div>

      {/* LEFT SIDE: Chat Interface */}
      <div className={`flex flex-col h-full relative z-10 transition-all duration-500 ease-out ${showMap ? "w-1/2" : "w-full"}`}>

        {/* Chat Header */}
        <div className={`px-6 py-4 border-b backdrop-blur-xl flex items-center gap-3
          ${isLightMode
            ? 'border-black/5 bg-white/60'
            : 'border-white/5 bg-slate-900/60'
          }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isLightMode ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
            <Bot size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-sm font-bold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Medical Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className={`text-[10px] font-medium ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>Online · AI-powered diagnostics</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${isLightMode ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/10 text-cyan-400'}`}>
            <Sparkles size={10} />
            AI
          </div>
        </div>

        {/* Messages List */}
        <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-5`}>
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                ${msg.sender === "user"
                  ? isLightMode ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/15 text-cyan-400'
                  : isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-800/60 text-slate-400'
                }`}>
                {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[75%] group relative`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-xl border transition-all duration-300
                  ${msg.sender === "user"
                    ? isLightMode
                      ? 'bg-cyan-600 text-white border-cyan-500 rounded-br-md shadow-[0_0_20px_rgba(8,145,178,0.15)]'
                      : 'bg-slate-800/80 text-cyan-100 border-cyan-500/20 rounded-br-md shadow-[0_0_20px_rgba(34,211,238,0.08)]'
                    : isLightMode
                      ? 'bg-white/80 text-slate-700 border-black/5 rounded-bl-md shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
                      : 'bg-slate-800/40 text-slate-300 border-white/5 rounded-bl-md shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                  }`}>

                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Speak Button */}
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => handleSpeak(msg.text, msg.lang)}
                      className={`absolute -right-10 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200
                        ${isLightMode
                          ? 'bg-slate-100 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50'
                          : 'bg-slate-800 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                    >
                      <Volume2 size={13} />
                    </button>
                  )}

                  {/* Find Hospital Button */}
                  {msg.sender === "bot" && msg.search_type && (
                    <button
                      onClick={() => fetchNearbyHospitals(msg.search_type)}
                      className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                        ${isLightMode
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15'
                        }`}
                    >
                      <MapPin size={13} />
                      Find nearby {msg.search_type}s
                    </button>
                  )}

                  {/* Citations */}
                  {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                    <div className={`mt-3 pt-3 border-t ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <BookOpen size={10} /> Referenced Cases
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((source, idx) => (
                          <div key={idx} className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer
                            ${isLightMode
                              ? 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200'
                              : 'bg-slate-700/40 border border-white/5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20'
                            }`}>
                            Case #{source.id}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                ${isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-800/60 text-slate-400'}`}>
                <Bot size={14} />
              </div>
              <div className={`px-5 py-4 rounded-2xl rounded-bl-md backdrop-blur-xl border
                ${isLightMode
                  ? 'bg-white/80 border-black/5'
                  : 'bg-slate-800/40 border-white/5'
                }`}>
                <div className="flex gap-1.5">
                  <span className={`w-2 h-2 rounded-full animate-bounce ${isLightMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} style={{ animationDelay: '0ms' }} />
                  <span className={`w-2 h-2 rounded-full animate-bounce ${isLightMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} style={{ animationDelay: '150ms' }} />
                  <span className={`w-2 h-2 rounded-full animate-bounce ${isLightMode ? 'bg-cyan-400' : 'bg-cyan-500'}`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className={`px-6 py-4 border-t backdrop-blur-xl
          ${isLightMode
            ? 'border-black/5 bg-white/60'
            : 'border-white/5 bg-slate-900/60'
          }`}>
          <div className="flex items-center gap-2">
            {/* Mic button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-xl transition-all duration-300 outline-none shrink-0
                ${isRecording
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                  : isLightMode
                    ? 'bg-slate-100 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 border border-transparent'
                    : 'bg-slate-800/60 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 border border-white/5'
                }`}
            >
              {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>

            {/* Input field */}
            <div className={`flex-1 flex items-center rounded-xl border transition-all duration-200 px-4
              ${isLightMode
                ? 'bg-white/80 border-slate-200 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(8,145,178,0.08)]'
                : 'bg-slate-800/60 border-white/5 focus-within:border-cyan-500/40 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.06)]'
              }`}>
              <input
                type="text"
                placeholder={isRecording ? "Listening..." : "Describe your symptoms..."}
                className={`w-full py-3.5 text-sm bg-transparent outline-none
                  ${isLightMode
                    ? 'text-slate-800 placeholder-slate-400'
                    : 'text-white placeholder-slate-600'
                  }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all duration-300 outline-none shrink-0 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-30 disabled:hover:scale-100
                ${isLightMode
                  ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.3)]'
                  : 'bg-slate-800 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:border-cyan-400'
                }`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Bottom hint */}
          <div className={`flex items-center justify-center gap-1.5 mt-2 ${isLightMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <Activity size={10} />
            <span className="text-[10px] font-medium">AI-powered medical assistant · Not a substitute for professional medical advice</span>
          </div>
        </form>
      </div>

      {/* RIGHT SIDE: Map Panel */}
      {showMap && userLocation && (
        <div className={`w-1/2 h-full relative z-10 border-l transition-all duration-500
          ${isLightMode ? 'border-black/5' : 'border-white/5'}`}>

          {/* Map close button */}
          <button
            onClick={() => setShowMap(false)}
            className={`absolute top-4 right-4 z-[1000] p-2 rounded-xl backdrop-blur-xl transition-all duration-200 hover:scale-105
              ${isLightMode
                ? 'bg-white/90 text-slate-600 border border-black/5 shadow-lg hover:text-red-500'
                : 'bg-slate-900/90 text-slate-300 border border-white/10 shadow-lg hover:text-red-400'
              }`}
          >
            <X size={18} />
          </button>

          {/* Map header overlay */}
          <div className={`absolute top-4 left-4 z-[1000] px-4 py-2 rounded-xl backdrop-blur-xl border
            ${isLightMode
              ? 'bg-white/90 border-black/5 shadow-lg'
              : 'bg-slate-900/90 border-white/10 shadow-lg'
            }`}>
            <div className="flex items-center gap-2">
              <MapPin size={13} className={isLightMode ? 'text-cyan-600' : 'text-cyan-400'} />
              <span className={`text-xs font-bold ${isLightMode ? 'text-slate-700' : 'text-white'}`}>
                {hospitals.length} facilities found
              </span>
            </div>
          </div>

          <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />

            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>📍 You are here</Popup>
            </Marker>

            {hospitals.map(hospital => (
              <Marker key={hospital.id} position={[hospital.lat, hospital.lng]}>
                <Popup>
                  <div className="font-bold text-sm">{hospital.name}</div>
                  <div className="text-xs text-slate-500 mb-2 capitalize">{hospital.type}</div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-cyan-600 text-white text-xs py-1.5 px-3 rounded hover:bg-cyan-700 no-underline mt-2"
                  >
                    📍 Get Directions
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .anim-fade-in { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default ChatBot;