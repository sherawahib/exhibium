"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Visitor = {
  id: number;
  label: string;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

function Focus({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 6, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

export default function VisitorsMap({
  visitors,
  focusId,
  onSelect,
}: {
  visitors: Visitor[];
  focusId: number | null;
  onSelect: (id: number) => void;
}) {
  const points = useMemo(
    () =>
      visitors.filter(
        (v) => v.latitude != null && v.longitude != null,
      ) as Array<Visitor & { latitude: number; longitude: number }>,
    [visitors],
  );

  const focus = points.find((p) => p.id === focusId) || points[0];

  return (
    <div className="admin-map">
      <MapContainer
        center={[focus?.latitude || 20, focus?.longitude || 0]}
        zoom={focus ? 5 : 2}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {focus ? <Focus lat={focus.latitude} lng={focus.longitude} /> : null}
        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={p.id === focusId ? 11 : 7}
            pathOptions={{
              color: p.id === focusId ? "#d96b1c" : "#0b1d3a",
              fillColor: p.id === focusId ? "#ef8a3a" : "#132d52",
              fillOpacity: 0.85,
            }}
            eventHandlers={{ click: () => onSelect(p.id) }}
          >
            <Popup>
              <strong>{p.label}</strong>
              <br />
              {[p.city, p.region, p.country].filter(Boolean).join(", ")}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
