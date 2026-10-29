// Feed Peringatan Dini Cuaca BMKG lewat proxy (lihat api/bmkg-alerts.js).
export const ALERTS_PROXY_URL =
  import.meta.env.VITE_ALERTS_PROXY_URL ?? '/api/bmkg-alerts';

export const SEVERITY = {
  Extreme: {
    label: 'Ekstrem',
    rank: 4,
    hex: '#b91c1c',
    badge: 'bg-red-50 text-red-800 ring-red-700/25',
  },
  Severe: {
    label: 'Berat',
    rank: 3,
    hex: '#dc2626',
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
  },
  Moderate: {
    label: 'Sedang',
    rank: 2,
    hex: '#f97316',
    badge: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  },
  Minor: {
    label: 'Ringan',
    rank: 1,
    hex: '#f59e0b',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
};

export const getSeverity = (severity) => SEVERITY[severity] ?? SEVERITY.Minor;

const text = (node, tag) =>
  node.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';

const parseXml = (xml) => new DOMParser().parseFromString(xml, 'application/xml');

// Uraikan deskripsi BMKG menjadi daftar kecamatan, dampak, dan batas waktu.
export const parseDescription = (description = '') => {
  const districts =
    description
      .match(/khususnya di (.+?)\.\s*(\n|$)/s)?.[1]
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean) ?? [];
  const dampak = description.match(/dampak berupa (.+?)\./)?.[1] ?? '';
  return { districts, dampak };
};

// RSS -> [{ title, file, description, pubDate, province }]
export const parseAlertsRss = (xml) =>
  Array.from(parseXml(xml).getElementsByTagName('item')).map((item) => {
    const title = text(item, 'title');
    const link = text(item, 'link');
    return {
      title,
      file: link.split('/').pop(),
      description: text(item, 'description'),
      pubDate: new Date(text(item, 'pubDate')),
      province: title.split(' di ').pop(),
    };
  });

// CAP -> detail peringatan termasuk poligon area ([[lat, lon], ...]).
export const parseAlertCap = (xml) => {
  const doc = parseXml(xml);
  return {
    event: text(doc, 'event'),
    severity: text(doc, 'severity'),
    urgency: text(doc, 'urgency'),
    certainty: text(doc, 'certainty'),
    effective: new Date(text(doc, 'effective')),
    expires: new Date(text(doc, 'expires')),
    infografis: text(doc, 'web'),
    areaDesc: text(doc, 'areaDesc'),
    polygons: Array.from(doc.getElementsByTagName('polygon')).map((polygon) =>
      polygon.textContent
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(',').map(Number))
    ),
  };
};

export const formatAlertTime = (date) =>
  date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

// Cocokkan nama provinsi BMKG ("DI Yogyakarta") dengan nama wilayah lain
// ("DAERAH ISTIMEWA YOGYAKARTA") secara longgar.
const normalizeProvince = (name = '') =>
  name
    .toLowerCase()
    .replace(/daerah istimewa|^di\s|dki\s|daerah khusus ibukota|provinsi/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const isSameProvince = (a, b) =>
  Boolean(a && b) && normalizeProvince(a) === normalizeProvince(b);
