import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Building2, Phone, ExternalLink, Loader2, AlertCircle, CheckCircle, Activity, ArrowRight, Globe, Zap } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useLocation from './useLocation';

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
   MAP RECENTER COMPONENT
───────────────────────────────────────────── */
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

/* ─────────────────────────────────────────────
   HOSPITAL RESULT CARD
───────────────────────────────────────────── */
function HospitalCard({ hospital, index, isLightMode }) {
  return (
    <div
      className={`group relative rounded-2xl p-4 border backdrop-blur-xl transition-all duration-500 overflow-hidden anim-slide-up
        ${isLightMode
          ? 'bg-white/60 border-black/5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(8,145,178,0.08)]'
          : 'bg-slate-800/20 border-white/5 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]'
        }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent'}`} />

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isLightMode ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
          <Building2 size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm truncate ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{hospital.name}</h4>
          <p className={`text-xs capitalize ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>{hospital.type || 'Hospital'}</p>
          {hospital.distance && (
            <p className={`text-[11px] mt-1 ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>{hospital.distance}</p>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105
            ${isLightMode
              ? 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
              : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            }`}
        >
          <Navigation size={13} />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOSPITAL LOCATOR PAGE
───────────────────────────────────────────── */
const HospitalLocator = ({ isLightMode = false }) => {
  const { isLoading: isLoadingCoords, position, error: locError, getLocation } = useLocation();
  const [address, setAddress] = useState(null);
  const [isFindingAddress, setIsFindingAddress] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('hospital');
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const searchTypes = [
    { value: 'hospital', label: 'Hospitals' },
    { value: 'clinic', label: 'Clinics' },
    { value: 'pharmacy', label: 'Pharmacies' },
  ];

  // Reverse geocode position to address
  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      setIsFindingAddress(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
        if (!response.ok) throw new Error('Failed to fetch address.');
        const data = await response.json();
        const { city, town, village, state } = data.address || {};
        const locationName = city || town || village;
        const addressParts = [locationName, state].filter(Boolean);
        setAddress(addressParts.join(', ') || 'Location found');
      } catch (err) {
        setAddress('Location detected');
        console.error("Reverse geocoding error:", err);
      } finally {
        setIsFindingAddress(false);
      }
    };

    fetchAddress();
  }, [position]);

  // Search for nearby hospitals
  const handleSearch = async () => {
    if (!position) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`${API_URL}/api/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: position.lat,
          lng: position.lng,
          type: searchType
        }),
      });

      const data = await response.json();
      if (data.hospitals && data.hospitals.length > 0) {
        setHospitals(data.hospitals);
      } else {
        setHospitals([]);
        setSearchError(`No ${searchType}s found nearby. Try a different category.`);
      }
    } catch (error) {
      console.error("Search Error:", error);
      setSearchError("Unable to connect to the search service. Make sure the backend is running.");
      setHospitals([]);
    } finally {
      setIsSearching(false);
    }
  };

  const isLoading = isLoadingCoords || isFindingAddress;

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans transition-colors duration-700 selection:bg-cyan-500/30 ${isLightMode ? 'bg-slate-50 text-slate-800' : 'bg-[#020617] text-slate-300'}`}>
      <AmbientBackground isLightMode={isLightMode} />

      <div className="relative z-10 pt-24 px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>Emergency services</p>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4`}>
              <span className={`bg-clip-text text-transparent ${isLightMode ? 'bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-500' : 'bg-gradient-to-br from-white via-cyan-100 to-cyan-500'}`}>
                Hospital Locator
              </span>
            </h1>
            <p className={`text-base max-w-lg mx-auto font-light ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Find nearby hospitals, clinics, and pharmacies. We'll detect your location and search for the closest facilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-6">

            {/* LEFT PANEL: Controls */}
            <div className="space-y-4">

              {/* Location Detection Card */}
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

                <div className="p-6">
                  <div className="text-center mb-5">
                    <div className="relative w-14 h-14 mx-auto mb-3">
                      <PulseRings isLightMode={isLightMode} />
                      <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500
                        ${isLightMode
                          ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] text-cyan-600'
                          : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-cyan-400'
                        }`}>
                        <MapPin size={22} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      </div>
                    </div>
                    <h2 className={`text-base font-bold tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Your Location</h2>
                    <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {position ? (address || 'Location detected') : 'Click below to detect'}
                    </p>
                  </div>

                  {/* Location status */}
                  {position && (
                    <div className={`rounded-xl p-3 border mb-4 anim-fade-in
                      ${isLightMode
                        ? 'bg-emerald-50/80 border-emerald-200/60'
                        : 'bg-emerald-500/5 border-emerald-500/15'
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span className={`text-xs font-bold ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>Location Detected</span>
                      </div>
                      <div className={`text-[11px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {position.lat.toFixed(6)}°N, {position.lng.toFixed(6)}°E
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {locError && (
                    <div className={`rounded-xl p-3 border mb-4 anim-fade-in
                      ${isLightMode
                        ? 'bg-red-50/80 border-red-200/60'
                        : 'bg-red-500/5 border-red-500/15'
                      }`}>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={12} className="text-red-500" />
                        <span className={`text-xs ${isLightMode ? 'text-red-700' : 'text-red-400'}`}>{locError}</span>
                      </div>
                    </div>
                  )}

                  {/* Detect button */}
                  {!position && (
                    <button
                      onClick={getLocation}
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group outline-none hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100
                        ${isLightMode
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.25)] hover:shadow-[0_0_40px_rgba(8,145,178,0.35)]'
                          : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.12)] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)] hover:border-cyan-400'
                        }`}
                    >
                      {isLoading ? (
                        <><Loader2 size={15} className="animate-spin" /> Detecting...</>
                      ) : (
                        <><Navigation size={15} /> Detect My Location</>
                      )}
                    </button>
                  )}

                  {/* Search Type Toggle */}
                  {position && (
                    <div className="anim-fade-in">
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Search For
                      </label>
                      <div className={`flex rounded-xl p-1 mb-4 ${isLightMode ? 'bg-slate-100/80' : 'bg-slate-800/60'}`}>
                        {searchTypes.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => setSearchType(t.value)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize tracking-wide transition-all duration-300
                              ${searchType === t.value
                                ? isLightMode
                                  ? 'bg-white text-cyan-700 shadow-sm border border-cyan-200/60'
                                  : 'bg-slate-700/80 text-cyan-300 shadow-sm border border-cyan-500/20'
                                : isLightMode ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                              }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group outline-none hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100
                          ${isLightMode
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.25)] hover:shadow-[0_0_40px_rgba(8,145,178,0.35)]'
                            : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.12)] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)] hover:border-cyan-400'
                          }`}
                      >
                        {isSearching ? (
                          <><Loader2 size={15} className="animate-spin" /> Searching...</>
                        ) : (
                          <><Search size={15} /> Find Nearby {searchTypes.find(t => t.value === searchType)?.label}</>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Trust row */}
                  <div className={`flex justify-center gap-3 mt-4 text-[10px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {['GPS Accurate', 'Real-time', 'Directions'].map((t, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <CheckCircle size={9} className={isLightMode ? 'text-cyan-500' : 'text-cyan-600'} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hospital Results List */}
              {hospitals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-end justify-between mb-1">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/80'}`}>
                      {hospitals.length} results found
                    </p>
                  </div>
                  {hospitals.map((hospital, i) => (
                    <HospitalCard key={hospital.id || i} hospital={hospital} index={i} isLightMode={isLightMode} />
                  ))}
                </div>
              )}

              {/* Search Error */}
              {searchError && (
                <div className={`rounded-2xl p-4 border backdrop-blur-xl anim-fade-in
                  ${isLightMode
                    ? 'bg-amber-50/80 border-amber-200/60'
                    : 'bg-amber-500/5 border-amber-500/15'
                  }`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    <p className={`text-xs ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`}>{searchError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Map */}
            <div className={`relative rounded-3xl border overflow-hidden backdrop-blur-xl min-h-[500px]
              ${isLightMode
                ? 'bg-white/60 border-black/5 shadow-[0_0_40px_rgba(8,145,178,0.06)]'
                : 'bg-slate-900/50 border-cyan-500/15 shadow-[0_0_40px_rgba(34,211,238,0.05)]'
              }`}>
              <div className={`absolute top-0 left-0 right-0 h-px z-20 ${isLightMode ? 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent'}`} />

              {position ? (
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%', minHeight: '500px', borderRadius: '1.5rem' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <MapRecenter lat={position.lat} lng={position.lng} />
                  <Marker position={[position.lat, position.lng]}>
                    <Popup>
                      <div className="font-bold text-sm">📍 You are here</div>
                      {address && <div className="text-xs text-slate-500 mt-1">{address}</div>}
                    </Popup>
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
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center px-8">
                  <div className="relative w-20 h-20 mb-6">
                    <PulseRings isLightMode={isLightMode} />
                    <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center border
                      ${isLightMode
                        ? 'bg-white border-cyan-300 shadow-[0_0_40px_rgba(8,145,178,0.15)] text-cyan-600'
                        : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-cyan-400'
                      }`}>
                      <Globe size={30} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold tracking-tight mb-2 ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                    Enable Location Access
                  </h3>
                  <p className={`text-sm max-w-xs ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click "Detect My Location" to see the interactive map and find nearby healthcare facilities.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-16 opacity-60">
            <Activity size={13} className={isLightMode ? 'text-cyan-600' : 'text-cyan-500'} />
            <p className={`text-xs font-medium tracking-wide ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              CareBridgeAI © {new Date().getFullYear()} — Empowering Humanitarian Aid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalLocator;
