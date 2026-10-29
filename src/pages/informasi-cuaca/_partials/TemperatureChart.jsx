import { useEffect, useRef, useState } from 'react';
import { formatHour } from '../../../utils/cuaca';

const HEIGHT = 200;
const PAD = { top: 28, right: 20, bottom: 28, left: 36 };
const LINE_COLOR = '#0d9488'; // teal-600

// Grafik garis suhu per 3 jam untuk satu hari, dengan crosshair + tooltip.
const TemperatureChart = ({ entries }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (entries.length < 2) return null;

  const temps = entries.map((e) => e.t);
  const min = Math.floor(Math.min(...temps)) - 2;
  const max = Math.ceil(Math.max(...temps)) + 2;
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (innerW * i) / (entries.length - 1);
  const y = (t) => PAD.top + innerH - ((t - min) / (max - min)) * innerH;
  const ticks = [min, Math.round((min + max) / 2), max];
  const path = entries
    .map((e, i) => `${i ? 'L' : 'M'}${x(i)},${y(e.t)}`)
    .join(' ');
  const maxIndex = temps.indexOf(Math.max(...temps));
  const minIndex = temps.indexOf(Math.min(...temps));

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - PAD.left) / innerW;
    const index = Math.round(ratio * (entries.length - 1));
    setHover(Math.min(entries.length - 1, Math.max(0, index)));
  };

  const hovered = hover !== null ? entries[hover] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label="Grafik suhu per 3 jam"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        className="block"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#e2e8f0"
              strokeDasharray={tick === min ? undefined : '3 3'}
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              dy="0.32em"
              textAnchor="end"
              className="fill-slate-400 text-[11px]"
            >
              {tick}°
            </text>
          </g>
        ))}

        {entries.map((e, i) => (
          <text
            key={e.local_datetime}
            x={x(i)}
            y={HEIGHT - 8}
            textAnchor="middle"
            className="fill-slate-400 text-[11px]"
          >
            {formatHour(e.local_datetime)}
          </text>
        ))}

        <path
          d={path}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Label langsung hanya untuk titik tertinggi & terendah. */}
        {[maxIndex, minIndex].map((i) => (
          <text
            key={`label-${i}`}
            x={x(i)}
            y={y(entries[i].t) - 10}
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-semibold"
          >
            {entries[i].t}°
          </text>
        ))}

        {hovered && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + innerH}
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <circle
              cx={x(hover)}
              cy={y(hovered.t)}
              r="5"
              fill={LINE_COLOR}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 z-10 w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{
            left: Math.min(Math.max(x(hover) - 80, 0), width - 160),
          }}
        >
          <div className="font-semibold text-slate-900">
            {formatHour(hovered.local_datetime)} · {hovered.t}°C
          </div>
          <div className="text-slate-600">{hovered.weather_desc}</div>
          <div className="mt-1 text-slate-500">
            Hujan {hovered.tp} mm · Lembap {hovered.hu}%
          </div>
        </div>
      )}
    </div>
  );
};

export default TemperatureChart;
