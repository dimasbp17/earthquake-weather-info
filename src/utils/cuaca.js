export const BMKG_CUACA_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';

// Kode wilayah default: Kemayoran, Jakarta Pusat.
export const DEFAULT_ADM4 = '31.71.03.1001';

// ID kelurahan emsifa ("3171031001") -> kode adm4 BMKG ("31.71.03.1001").
export const toAdm4 = (villageId = '') =>
  `${villageId.slice(0, 2)}.${villageId.slice(2, 4)}.${villageId.slice(4, 6)}.${villageId.slice(6)}`;

const WIND_DIRECTIONS = {
  N: 'Utara',
  NE: 'Timur Laut',
  E: 'Timur',
  SE: 'Tenggara',
  S: 'Selatan',
  SW: 'Barat Daya',
  W: 'Barat',
  NW: 'Barat Laut',
};

export const getWindDirection = (code) => WIND_DIRECTIONS[code] ?? code;

// "2026-10-30 03:00:00" (waktu lokal) -> Date tanpa konversi zona waktu.
export const parseLocalDatetime = (value) => new Date(value.replace(' ', 'T'));

export const formatHour = (value) =>
  parseLocalDatetime(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDay = (value, options = { weekday: 'long' }) =>
  parseLocalDatetime(value).toLocaleDateString('id-ID', options);

export const iconUrl = (image) => (image ? encodeURI(image) : '');

// Kelompokkan prakiraan per tanggal lokal.
export const groupByDay = (entries) =>
  entries.reduce((days, entry) => {
    const key = entry.local_datetime.slice(0, 10);
    const day = days.find((d) => d.key === key);
    if (day) day.entries.push(entry);
    else days.push({ key, entries: [entry] });
    return days;
  }, []);

// analysis_date BMKG dalam UTC tanpa penanda zona, mis. "2026-10-29T12:00:00".
export const formatAnalysisDate = (value) =>
  new Date(`${value}Z`).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

// Ringkasan harian: suhu min/maks, total hujan, dan kondisi yang paling sering.
export const summarizeDay = (entries) => {
  const temps = entries.map((e) => e.t);
  const counts = entries.reduce((acc, e) => {
    acc[e.weather_desc] = (acc[e.weather_desc] ?? 0) + 1;
    return acc;
  }, {});
  const dominantDesc = Object.keys(counts).reduce((a, b) =>
    counts[b] > counts[a] ? b : a
  );
  // Pakai slot terdekat dengan tengah hari agar ikonnya versi siang.
  const dominant = entries
    .filter((e) => e.weather_desc === dominantDesc)
    .reduce((a, b) =>
      Math.abs(parseLocalDatetime(b.local_datetime).getHours() - 12) <
      Math.abs(parseLocalDatetime(a.local_datetime).getHours() - 12)
        ? b
        : a
    );
  const rain = entries.reduce((sum, e) => sum + (e.tp ?? 0), 0);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
    rain: Math.round(rain * 10) / 10,
    dominant,
  };
};
