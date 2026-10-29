import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ESRI_CANVAS_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';

// Pusat & zoom default: seluruh wilayah Indonesia.
const INDONESIA_CENTER = [-2.5, 118];

// Sesuaikan tampilan peta agar semua titik `points` ([lat, lon]) terlihat.
export const FitBounds = ({ points, maxZoom = 7 }) => {
  const map = useMap();
  const key = JSON.stringify(points);

  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], maxZoom);
    } else {
      map.fitBounds(points, { padding: [32, 32], maxZoom });
    }
    // `key` mewakili isi `points` agar tidak memicu ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, maxZoom]);

  return null;
};

const BaseMap = ({
  center = INDONESIA_CENTER,
  zoom = 5,
  className = 'h-96',
  children,
}) => {
  return (
    <div className={`isolate w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="size-full"
      >
        {/* Basemap abu-abu terang Esri (tanpa API key) + lapisan label terpisah. */}
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
          url={`${ESRI_CANVAS_URL}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`}
          maxZoom={16}
        />
        <TileLayer
          url={`${ESRI_CANVAS_URL}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`}
          maxZoom={16}
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default BaseMap;
