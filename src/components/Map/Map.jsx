import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import source from "../../assets/source.png";
import destination from "../../assets/destination.png";
import moving from "../../assets/moving.png";

const startCoords = [22.1696, 91.4996];
const endCoords = [22.2637, 91.7159];
const speed = 2000; // km/h
const refreshRate = 2; // FPS
const vesselLength = 14.005;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

const offsetPosition = (lat, lon, bearing, distance) => {
  const bearingRad = bearing * (Math.PI / 180);
  const newLat = lat + (distance / 6371) * (180 / Math.PI) * Math.cos(bearingRad);
  const newLon = lon + (distance / 6371) * (180 / Math.PI) * Math.sin(bearingRad) / Math.cos(lat * (Math.PI / 180));
  return [newLat, newLon];
};

const Map = () => {
  const [position, setPosition] = useState(startCoords);
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    const distance = calculateDistance(...startCoords, ...endCoords);
    const totalTime = distance / speed;
    const steps = totalTime * refreshRate * 3600;

    const initialBearing = calculateBearing(...startCoords, ...endCoords);
    setBearing(initialBearing);

    const adjustedStartCoords = offsetPosition(...startCoords, initialBearing, vesselLength);

    const latStep = (endCoords[0] - adjustedStartCoords[0]) / steps;
    const lonStep = (endCoords[1] - adjustedStartCoords[1]) / steps;

    const interval = setInterval(() => {
      setPosition(prevPos => {
        const newLat = prevPos[0] + latStep;
        const newLon = prevPos[1] + lonStep;

        if (
          Math.abs(newLat - endCoords[0]) < Math.abs(latStep) &&
          Math.abs(newLon - endCoords[1]) < Math.abs(lonStep)
        ) {
          clearInterval(interval);
          return endCoords;
        }

        setBearing(calculateBearing(newLat, newLon, ...endCoords));

        return [newLat, newLon];
      });
    }, 1000 / refreshRate);

    setPosition(adjustedStartCoords);

    return () => clearInterval(interval);
  }, []);

  const startIcon = L.icon({
    iconUrl: source,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  const endIcon = L.icon({
    iconUrl: destination,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  const vesselIcon = L.divIcon({
    html: `<img src="${moving}" style="transform: rotate(${bearing}deg); height:100px;" alt="Vessel"/>`,
    className: '',
    iconSize: [100, 100],
    iconAnchor: [50, 50],
  });  

  return (
    <MapContainer
      center={startCoords}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: '100vh',borderRadius: '15px', width: '100%'}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={startCoords} icon={startIcon}>
        <Popup>Starting Point</Popup>
      </Marker>
      <Marker position={endCoords} icon={endIcon}>
        <Popup>Ending Point</Popup>
      </Marker>
      <Marker position={position} icon={vesselIcon}>
        <Popup>Vessel Position</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;