import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, BookOpen, Volume2, StopCircle, MapPin, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix for default Leaflet marker icons in React ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  
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

  // 1. Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // 2. Get User Location on Load
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
      const response = await fetch('http://127.0.0.1:5000/api/speak', {
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
        const response = await fetch('http://127.0.0.1:5000/api/hospitals', {
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
            setShowMap(true); // <--- Trigger the slide animation
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
            const res = await fetch("http://127.0.0.1:5000/api/voicesearch", { method: "POST", body: formData });
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
      const response = await fetch('http://127.0.0.1:5000/api/chat', { 
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
      setMessages((prev) => [...prev, { text: "Error connecting to server.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden relative">
      
      {/* LEFT SIDE: Chat Interface */}
      <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${showMap ? "w-1/2 border-r border-slate-200" : "w-full"}`}>
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-100 text-slate-700 rounded-bl-none"
                }`}>
                
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {/* Speak Button */}
                {msg.sender === "bot" && (
                    <button 
                        onClick={() => handleSpeak(msg.text, msg.lang)}
                        className="absolute -right-8 top-2 p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Volume2 size={14} />
                    </button>
                )}

                {/* Find Hospital Button */}
                {msg.sender === "bot" && msg.search_type && (
                    <button 
                        onClick={() => fetchNearbyHospitals(msg.search_type)}
                        className="mt-3 flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                    >
                        <MapPin size={14} />
                        Find nearby {msg.search_type}s
                    </button>
                )}

                {/* Citations */}
                {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                        <BookOpen size={12} /> Referenced Cases:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                        <div key={idx} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors">
                            Case #{source.id}
                        </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex items-start">
                    <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto relative flex items-center gap-2">
                <button 
                    type="button" 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-xl transition-all ${
                        isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                    {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>

                <input
                    type="text"
                    placeholder={isRecording ? "Listening..." : "Describe symptoms..."}
                    className="w-full pl-5 pr-4 py-4 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                
                <button type="submit" className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </form>
      </div>

      {/* RIGHT SIDE: Map Panel (Slides in when active) */}
      {showMap && userLocation && (
        <div className="w-1/2 h-full relative animate-in slide-in-from-right duration-300">
            <button 
                onClick={() => setShowMap(false)} 
                className="absolute top-4 right-4 z-1000 bg-white text-slate-700 p-2 rounded-full shadow-lg hover:bg-slate-100"
            >
                <X size={20} />
            </button>
            
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap' />
                
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>You are here</Popup>
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
                                className="block w-full text-center bg-blue-600 text-white text-xs py-1.5 px-3 rounded hover:bg-blue-700 text-decoration-none mt-2"
                            >
                                📍 Get Directions
                            </a>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ChatBot;