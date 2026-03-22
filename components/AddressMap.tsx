'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface AddressMapProps {
  onLocationSelect: (address: string) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (addr: string) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=uk`);
        const data = await response.json();
        if (data && data.display_name) {
          onLocationSelect(data.display_name);
        }
      } catch (error) {
        console.error("Error fetching reverse geocode:", error);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  )
}

export default function AddressMap({ onLocationSelect }: AddressMapProps) {
  const defaultCenter: [number, number] = [50.4501, 30.5234];

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 z-0 relative isolate">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
