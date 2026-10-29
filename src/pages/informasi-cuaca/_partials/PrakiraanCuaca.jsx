import { useMemo, useState } from 'react';
import { CircleMarker } from 'react-leaflet';
import {
  TbArrowNarrowUp,
  TbCloud,
  TbDroplet,
  TbEye,
  TbMapPin,
  TbUmbrella,
  TbWind,
} from 'react-icons/tb';
import useFetch from '../../../hooks/useFetch';
import useAlerts from '../../../hooks/useAlerts';
import {
  BMKG_CUACA_URL,
  formatAnalysisDate,
  formatDay,
  formatHour,
  getWindDirection,
  groupByDay,
  iconUrl,
  parseLocalDatetime,
  summarizeDay,
} from '../../../utils/cuaca';
import { isSameProvince } from '../../../utils/peringatan';
import AlertBanner from '../../../components/AlertBanner';
import BaseMap from '../../../components/map/BaseMap';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/ui/StatusState';
import TemperatureChart from './TemperatureChart';

// Panah menunjuk ke arah tujuan angin (wd_deg = arah datangnya angin).
const WindArrow = ({ deg, className = 'size-4' }) => (
  <TbArrowNarrowUp
    className={className}
    style={{ transform: `rotate(${deg + 180}deg)` }}
    aria-hidden
  />
);

const Metric = ({ icon: Icon, label, value, extra }) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <dt className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="size-4" />
      {label}
    </dt>
    <dd className="tabular mt-1.5 flex items-center gap-2 text-lg font-semibold text-slate-900">
      {value}
      {extra}
    </dd>
  </div>
);

const PrakiraanCuaca = ({ adm4 }) => {
  const { data, loading, error, refetch } = useFetch(
    `${BMKG_CUACA_URL}?adm4=${adm4}`
  );
  const { alerts } = useAlerts();
  const [activeDay, setActiveDay] = useState(0);

  const lokasi = data?.lokasi;
  const entries = useMemo(
    () => data?.data?.[0]?.cuaca?.flat() ?? [],
    [data]
  );
  const days = useMemo(() => groupByDay(entries), [entries]);

  // Prakiraan aktif: slot 3 jam yang sedang berlangsung.
  const current = useMemo(() => {
    const now = Date.now();
    return (
      entries.find(
        (e) => parseLocalDatetime(e.local_datetime).getTime() + 90 * 60000 >= now
      ) ?? entries[0]
    );
  }, [entries]);

  if (loading) return <LoadingState label="Memuat prakiraan cuaca…" />;
  if (error)
    return (
      <div className="card">
        <ErrorState
          message="Prakiraan cuaca untuk wilayah ini belum tersedia."
          onRetry={refetch}
        />
      </div>
    );
  if (!current)
    return (
      <div className="card">
        <EmptyState />
      </div>
    );

  const selectedDay = days[Math.min(activeDay, days.length - 1)];
  const provinceAlerts = alerts.filter((alert) =>
    isSameProvince(alert.province, lokasi?.provinsi)
  );

  return (
    <div className="space-y-6">
      <AlertBanner
        alerts={provinceAlerts}
        title={`Peringatan dini cuaca berlaku di ${lokasi?.provinsi}`}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card relative overflow-hidden bg-slate-900 p-6 text-white lg:col-span-2">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="relative">
            <p className="flex items-start gap-1.5 text-sm text-slate-300">
              <TbMapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="font-semibold text-white">
                  {lokasi?.desa}
                </span>
                , {lokasi?.kecamatan}, {lokasi?.kotkab}, {lokasi?.provinsi}
              </span>
            </p>
            <div className="mt-8 flex items-center gap-5">
              <img
                src={iconUrl(current.image)}
                alt={current.weather_desc}
                className="size-20"
              />
              <div>
                <div className="tabular text-6xl font-semibold leading-none tracking-tight">
                  {current.t}°
                  <span className="align-top text-2xl text-slate-400">C</span>
                </div>
                <p className="mt-2 text-lg text-slate-200">
                  {current.weather_desc}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-1 text-xs text-slate-400">
              <p>
                Prakiraan {formatDay(current.local_datetime)},{' '}
                {formatHour(current.local_datetime)} waktu setempat
              </p>
              {current.analysis_date && (
                <p>
                  Dianalisis BMKG: {formatAnalysisDate(current.analysis_date)}
                </p>
              )}
            </div>
          </div>
        </div>

        <dl className="card grid grid-cols-2 content-start gap-3 p-6 lg:col-span-3">
          <h3 className="card-title col-span-2 mb-1">Kondisi saat ini</h3>
          <Metric
            icon={TbDroplet}
            label="Kelembapan"
            value={`${current.hu}%`}
          />
          <Metric
            icon={TbWind}
            label={`Angin dari ${getWindDirection(current.wd)}`}
            value={`${current.ws} km/j`}
            extra={
              current.wd_deg != null && (
                <span
                  className="flex size-7 items-center justify-center rounded-full bg-white text-teal-700 ring-1 ring-slate-200"
                  title={`Bertiup ke ${getWindDirection(current.wd_to)}`}
                >
                  <WindArrow deg={current.wd_deg} />
                </span>
              )
            }
          />
          <Metric
            icon={TbCloud}
            label="Tutupan awan"
            value={`${current.tcc}%`}
          />
          <Metric
            icon={TbUmbrella}
            label="Curah hujan"
            value={`${current.tp} mm`}
          />
          {current.vs_text && (
            <Metric
              icon={TbEye}
              label="Jarak pandang"
              value={current.vs_text}
            />
          )}
        </dl>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {days.map((day, index) => {
          const summary = summarizeDay(day.entries);
          const isActive = selectedDay.key === day.key;
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`card flex items-center gap-4 p-5 text-left transition ${
                isActive
                  ? 'ring-2 ring-teal-600/30'
                  : 'hover:border-slate-300'
              }`}
            >
              <img
                src={iconUrl(summary.dominant.image)}
                alt={summary.dominant.weather_desc}
                className="size-12 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold capitalize text-slate-900">
                  {formatDay(day.entries[0].local_datetime, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {summary.dominant.weather_desc} · hujan {summary.rain} mm
                </p>
              </div>
              <div className="tabular text-right text-sm">
                <div className="font-semibold text-slate-900">
                  {summary.max}°
                </div>
                <div className="text-slate-400">{summary.min}°</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 pb-2">
          <h3 className="text-base font-semibold text-slate-900">
            Suhu per 3 jam
          </h3>
          <p className="text-sm capitalize text-slate-500">
            {formatDay(selectedDay.entries[0].local_datetime, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <div className="px-4">
          <TemperatureChart entries={selectedDay.entries} />
        </div>

        <div className="flex gap-3 overflow-x-auto px-6 pb-6 pt-4 scrollbar-hide">
          {selectedDay.entries.map((entry) => {
            const isCurrent = entry.local_datetime === current.local_datetime;
            return (
              <div
                key={entry.local_datetime}
                className={`flex w-32 shrink-0 flex-col items-center rounded-xl border p-4 text-center ${
                  isCurrent
                    ? 'border-teal-600/40 bg-teal-50/60'
                    : 'border-slate-200'
                }`}
              >
                <span className="tabular text-sm font-semibold text-slate-900">
                  {formatHour(entry.local_datetime)}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
                    Sekarang
                  </span>
                )}
                <img
                  src={iconUrl(entry.image)}
                  alt={entry.weather_desc}
                  className="my-2 size-12"
                />
                <span className="tabular text-xl font-semibold text-slate-900">
                  {entry.t}°
                </span>
                <span className="mt-1 line-clamp-2 min-h-8 text-xs text-slate-500">
                  {entry.weather_desc}
                </span>
                <div className="mt-3 w-full space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <TbDroplet className="size-3.5" />
                    <span className="tabular">{entry.hu}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <TbUmbrella className="size-3.5" />
                    <span className="tabular">{entry.tp} mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <WindArrow
                      deg={entry.wd_deg}
                      className="size-3.5 text-teal-700"
                    />
                    <span className="tabular">
                      {entry.ws} · {entry.wd}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lokasi?.lat != null && (
        <div className="card grid overflow-hidden lg:grid-cols-3">
          <BaseMap
            center={[lokasi.lat, lokasi.lon]}
            zoom={12}
            className="h-64 lg:col-span-2 lg:h-full lg:min-h-64"
          >
            <CircleMarker
              center={[lokasi.lat, lokasi.lon]}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                weight: 2,
                fillColor: '#0d9488',
                fillOpacity: 0.9,
              }}
            />
          </BaseMap>
          <dl className="space-y-4 p-6 text-sm">
            <h3 className="card-title">Informasi lokasi</h3>
            {[
              ['Kelurahan / Desa', lokasi.desa],
              ['Kecamatan', lokasi.kecamatan],
              ['Kabupaten / Kota', lokasi.kotkab],
              [
                'Koordinat',
                `${lokasi.lat.toFixed(4)}, ${lokasi.lon.toFixed(4)}`,
              ],
              ['Zona waktu', lokasi.timezone],
              ['Kode wilayah (adm4)', lokasi.adm4],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="tabular mt-0.5 font-medium text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

export default PrakiraanCuaca;
