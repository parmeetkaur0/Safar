import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixes default marker icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({
        lat: -3.745,
        lng: -38.523,
    });

    // Custom hook to update the map's center
    const RecenterMap = ({ position }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(position, map.getZoom());
        }, [position, map]);
        return null;
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <MapContainer
            style={containerStyle}
            center={currentPosition}
            zoom={15}
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Marker position={currentPosition} />
            <RecenterMap position={currentPosition} />
        </MapContainer>
    );
};

export default LiveTracking;
