import { CircleMarker, Popup } from 'react-leaflet';
import BaseMap, { FitBounds } from '../../../components/map/BaseMap';
import { getMagnitudeLevel, parseCoordinates } from '../../../utils/gempa';

const LEGEND = ['3.0', '4.0', '5.0', '6.0'].map((m) => getMagnitudeLevel(m));

// Radius titik mengikuti magnitudo agar gempa besar menonjol.
const radiusFor = (magnitude) => Math.max(5, (parseFloat(magnitude) - 2) * 4);

const GempaMap = ({ list, className, maxZoom = 6, highlightFirst = false }) => {
  const points = list
    .map((gempa) => ({ gempa, ...parseCoordinates(gempa.Coordinates) }))
    .filter(({ lat, lon }) => !Number.isNaN(lat) && !Number.isNaN(lon));

  return (
    <div className="relative">
      <BaseMap className={className}>
        <FitBounds
          points={points.map(({ lat, lon }) => [lat, lon])}
          maxZoom={maxZoom}
        />
        {/* Gambar dari yang terlama agar gempa terbaru berada di atas. */}
        {[...points].reverse().map(({ gempa, lat, lon }, index) => {
          const level = getMagnitudeLevel(gempa.Magnitude);
          const isLatest = highlightFirst && index === points.length - 1;
          return (
            <CircleMarker
              key={`${gempa.DateTime}-${lat}-${lon}`}
              center={[lat, lon]}
              radius={radiusFor(gempa.Magnitude)}
              pathOptions={{
                color: isLatest ? '#0f172a' : '#ffffff',
                weight: 2,
                fillColor: level.hex,
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs">
                  <div className="text-sm font-semibold text-slate-900">
                    M {gempa.Magnitude} · {level.label}
                  </div>
                  <div className="text-slate-700">{gempa.Wilayah}</div>
                  <div className="text-slate-500">
                    {gempa.Tanggal}, {gempa.Jam} · Kedalaman {gempa.Kedalaman}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </BaseMap>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-card">
        <div className="mb-1 font-medium text-slate-900">Magnitudo</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {LEGEND.map((level, i) => (
            <span
              key={level.label}
              className="inline-flex items-center gap-1.5"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: level.hex }}
              />
              {['< 4', '4 – 4.9', '5 – 5.9', '≥ 6'][i]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GempaMap;
