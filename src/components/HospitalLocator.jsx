import React, { useState, useEffect } from 'react';
import useLocation from './useLocation';

const HospitalLocator = () => {
    const { isLoading: isLoadingCoords, position, error, getLocation } = useLocation();
    const [address, setAddress] = useState(null);
    const [isFindingAddress, setIsFindingAddress] = useState(false);

    useEffect(() => {
        if (!position) return;

        // Function to fetch the human-readable address from coordinates.
        const fetchAddress = async () => {
            setIsFindingAddress(true);
            try {
                // Fetch data from the OpenStreetMap API
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch address.');
                }
                const data = await response.json();
                
                // --- ADDRESS FORMATTING LOGIC ---
                const { city, town, village, state } = data.address || {};

                const locationName = city || town || village; 
                
                const addressParts = [locationName, state].filter(Boolean); 
                
                setAddress(addressParts.join(', ') || 'Location details not found.');
                

            } catch (err) {
                setAddress('Could not retrieve address.');
                console.error("Reverse geocoding error:", err);
            } finally {
                setIsFindingAddress(false);
            }
        };

        fetchAddress();
    }, [position]); 

    return (
        <div className="bg-gray-900 text-white min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight mb-4">
                    Find Your Location
                </h1>
                <p className="text-slate-300 mb-6">Click the button below to allow location access. We'll find your coordinates and current address.</p>
                
                <button 
                    onClick={getLocation} 
                    disabled={isLoadingCoords || isFindingAddress}
                    className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    {isLoadingCoords || isFindingAddress ? 'Working...' : 'Detect My Location'}
                </button>

                <div className="mt-8 text-left space-y-4">
                    {/* Loading indicator */}
                    {(isLoadingCoords || isFindingAddress) && (
                        <div className="animate-pulse p-4 bg-white/5 rounded-md">
                            <p className="text-slate-400">{isLoadingCoords ? 'Fetching your coordinates...' : 'Finding your address...'}</p>
                        </div>
                    )}
                    {/* Error message display */}
                    {error && <p className="text-red-400 font-semibold bg-red-900/30 p-4 rounded-md">Error: {error}</p>}
                    
                    {/* Results display */}
                    {position && address && !isFindingAddress && (
                        <div className="p-6 bg-green-900/20 border border-green-400/30 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3 text-slate-200">Your Location Details:</h2>
                            <div className="space-y-2">
                                <p><strong>Address:</strong> <span className="text-slate-300">{address}</span></p>
                                <p><strong>Latitude:</strong> <span className="font-mono text-green-400">{position.lat.toFixed(6)}</span></p>
                                <p><strong>Longitude:</strong> <span className="font-mono text-green-400">{position.lng.toFixed(6)}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalLocator;

