export const BMKG_TEWS_URL = 'https://data.bmkg.go.id/DataMKG/TEWS';

// Klasifikasi magnitudo untuk penanda visual.
export const getMagnitudeLevel = (magnitude) => {
  const m = parseFloat(magnitude);
  if (m >= 6)
    return {
      label: 'Sangat kuat',
      badge: 'bg-red-50 text-red-700 ring-red-600/20',
      solid: 'bg-red-600',
      hex: '#dc2626',
      text: 'text-red-600',
    };
  if (m >= 5)
    return {
      label: 'Kuat',
      badge: 'bg-orange-50 text-orange-700 ring-orange-600/20',
      solid: 'bg-orange-500',
      hex: '#f97316',
      text: 'text-orange-600',
    };
  if (m >= 4)
    return {
      label: 'Sedang',
      badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      solid: 'bg-amber-500',
      hex: '#f59e0b',
      text: 'text-amber-600',
    };
  return {
    label: 'Ringan',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    solid: 'bg-emerald-500',
    hex: '#10b981',
    text: 'text-emerald-600',
  };
};

// "Tidak berpotensi tsunami" -> aman, "Berpotensi tsunami" -> bahaya, lainnya -> info.
export const getPotensiTone = (potensi = '') => {
  const text = potensi.toLowerCase();
  if (text.includes('tidak berpotensi')) return 'safe';
  if (text.includes('berpotensi tsunami')) return 'danger';
  return 'info';
};

export const parseCoordinates = (coordinates = '') => {
  const [lat, lon] = coordinates.split(',').map(Number);
  return { lat, lon };
};

export const splitDirasakan = (dirasakan = '') =>
  dirasakan
    .split(',')
    .map((area) => area.trim())
    .filter(Boolean);

export const formatRelativeTime = (isoDate) => {
  const diffMinutes = Math.round((Date.now() - new Date(isoDate)) / 60000);
  if (Number.isNaN(diffMinutes)) return '';
  if (diffMinutes < 1) return 'baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
};
