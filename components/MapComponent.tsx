"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map centering when a spot is selected
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapComponentProps {
  spots: any[];
  selectedSpot: any | null;
  onSelectSpot: (spot: any) => void;
  isPickMode?: boolean;
  onPickLocation?: (lat: number, lng: number) => void;
  userLocation?: [number, number];
  isNavigating?: boolean;
  routeCoordinates?: [number, number][]; 
}

const MapComponent = ({ spots, selectedSpot, onSelectSpot, isPickMode, onPickLocation, userLocation, isNavigating, routeCoordinates }: MapComponentProps) => {
  const defaultCenter: [number, number] = [12.3052, 76.6552]; 
  const activeCenter: [number, number] = selectedSpot ? [selectedSpot.lat, selectedSpot.lng] : defaultCenter;

  const MapClickHandler = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        if (isPickMode && onPickLocation) {
          onPickLocation(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  };

  const createEmojiIcon = (spotId: string, hasEv: boolean) => {
    const isSelected = selectedSpot?.id === spotId;
    const emoji = hasEv ? "🔋" : "📍";
    const color = hasEv ? "#22c55e" : "#ef4444";
    
    return L.divIcon({
      html: `<div style="
        font-size: ${isSelected ? '36px' : '28px'};
        filter: ${isSelected ? `drop-shadow(0 0 10px ${color})` : 'none'};
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${isSelected ? `2px solid ${color}` : 'none'};
        background: ${isSelected ? 'rgba(255,255,255,0.9)' : 'transparent'};
        border-radius: 50%;
        padding: 4px;
      ">${emoji}</div>`,
      className: "custom-emoji-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler />
        
        {spots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]}
            icon={createEmojiIcon(spot.id, spot.hasEvCharging)}
            eventHandlers={{
              click: () => onSelectSpot(spot),
            }}
          >
            <Popup className="custom-popup" offset={[0, -10]}>
              <div className="p-2 min-w-[120px]">
                <h3 className="font-bold text-sm text-gray-900 mb-1">{spot.title}</h3>
                <p className="text-[10px] text-gray-500 mb-2">{spot.distanceKm || 2.5} km away</p>
                <div className="flex items-center justify-between border-t pt-2">
                   <div className="text-xs font-black text-electric-blue">₹{spot.basePrice || 50}/hr</div>
                   {spot.hasEvCharging && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">EV Ready</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation} icon={DefaultIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {isNavigating && routeCoordinates && routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#00f0ff', weight: 6, opacity: 0.8 }} 
          />
        )}

        <ChangeView center={activeCenter} zoom={15} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
