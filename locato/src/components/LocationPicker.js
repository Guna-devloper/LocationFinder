import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ setLocation }) => {
  const [position, setPosition] = useState([28.7041, 77.1025]); // Default: Delhi

  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);
        setLocation({ lat, lng });
      },
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      <MapClickHandler />
    </MapContainer>
  );
};

export default LocationPicker;
