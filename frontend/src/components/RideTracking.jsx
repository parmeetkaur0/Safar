import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RideTracking = ({ ride }) => {
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [route1, setRoute1] = useState(null);
  const [route2, setRoute2] = useState(null);

  useEffect(() => {
    // Fetch real-time captain location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCaptainLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error fetching captain location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (ride && ride.pickup && ride.destination) {
      fetchCoordinates(ride.pickup, setPickupCoords);
      fetchCoordinates(ride.destination, setDestinationCoords);
    }
  }, [ride]);

  const fetchCoordinates = async (location, setCoords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location + ", Bathinda, Punjab, India"
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        console.error("No coordinates found for:", location);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (captainLocation && pickupCoords) {
      fetchRoute(captainLocation, pickupCoords, setRoute1);
    }
    if (pickupCoords && destinationCoords) {
      fetchRoute(pickupCoords, destinationCoords, setRoute2);
    }
  }, [captainLocation, pickupCoords, destinationCoords]);

  const fetchRoute = async (start, end, setRoute) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {captainLocation && pickupCoords && destinationCoords ? (
        <MapContainer center={pickupCoords} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={captainLocation}></Marker>
          <Marker position={pickupCoords}></Marker>
          <Marker position={destinationCoords}></Marker>

          {route1 && <Polyline positions={route1} color="blue" />}
          {route2 && <Polyline positions={route2} color="red" />}
        </MapContainer>
      ) : (
        <h3 style={{ textAlign: "center", marginTop: "20px" }}>Loading map...</h3>
      )}
    </div>
  );
};

export default RideTracking;
