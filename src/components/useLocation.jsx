import { useState } from 'react';

const useLocation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);

    function getLocation() {
        if (!navigator.geolocation) {
            return setError('Your browser does not support geolocation.');
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // On success, update the position state
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                // On error, update the error state
                setError(error.message);
                setIsLoading(false);
            },
            // Options for the geolocation request
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }

    return { isLoading, position, error, getLocation };
};

export default useLocation;
