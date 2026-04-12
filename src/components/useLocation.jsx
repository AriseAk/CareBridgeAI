import { useState, useEffect, useCallback, useRef } from 'react';

const useLocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const watchIdRef = useRef(null);

  const handleSuccess = useCallback((pos) => {
    setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
    setAccuracy(pos.coords.accuracy);
    setTimestamp(pos.timestamp);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((err) => {
    const messages = {
      1: 'Location permission denied. Please enable location access in your browser settings.',
      2: 'Location unavailable. Please check your device settings.',
      3: 'Location request timed out. Please try again.',
    };
    setError(messages[err.code] || err.message);
    setIsLoading(false);
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  // Watch mode: continuously track position
  useEffect(() => {
    if (!watch || !navigator.geolocation) return;

    setIsLoading(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [watch, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  return {
    isLoading,
    position,
    error,
    accuracy,
    timestamp,
    getLocation,
    stopWatching,
  };
};

export default useLocation;
