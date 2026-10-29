import {
  TbArrowsMaximize,
  TbClock,
  TbCalendar,
  TbMapPin,
  TbRipple,
  TbWorldLatitude,
  TbWorldLongitude,
} from 'react-icons/tb';
import useFetch from '../../../hooks/useFetch';
import {
  BMKG_TEWS_URL,
  formatRelativeTime,
  getMagnitudeLevel,
  parseCoordinates,
  splitDirasakan,
} from '../../../utils/gempa';
import PotensiBadge from '../../../components/ui/PotensiBadge';
import { ErrorState, LoadingState } from '../../../components/ui/StatusState';
import GempaMap from './GempaMap';
import SigTable from './SigTable';

const GempaUpdate = () => {
  const { data, loading, error, updatedAt, refetch } = useFetch(
    `${BMKG_TEWS_URL}/autogempa.json`,
    { refreshInterval: 60000 }
  );
  const gempa = data?.Infogempa?.gempa;

  if (loading && !gempa) return <LoadingState label="Memuat gempa terbaru…" />;
  if (error && !gempa) return <ErrorState onRetry={refetch} />;
  if (!gempa) return null;

  const level = getMagnitudeLevel(gempa.Magnitude);
  const coordinates = parseCoordinates(gempa.Coordinates);
  const shakemapUrl = `${BMKG_TEWS_URL}/${gempa.Shakemap}`;

  const details = [
    { icon: TbCalendar, label: 'Tanggal', value: gempa.Tanggal },
    { icon: TbClock, label: 'Waktu', value: gempa.Jam },
    { icon: TbRipple, label: 'Kedalaman', value: gempa.Kedalaman },
    { icon: TbWorldLatitude, label: 'Lintang', value: gempa.Lintang },
    { icon: TbWorldLongitude, label: 'Bujur', value: gempa.Bujur },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
            <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-900 px-7 py-5 text-white">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Magnitudo
              </span>
              <span className="tabular mt-1 text-5xl font-semibold tracking-tight">
                {gempa.Magnitude}
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-300">
                <span className={`size-2 rounded-full ${level.solid}`} />
                {level.label}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                {formatRelativeTime(gempa.DateTime)}
                {updatedAt && (
                  <span className="text-slate-400">
                    · diperbarui otomatis tiap menit
                  </span>
                )}
              </div>
              <h2 className="mt-2 flex gap-2 text-xl font-semibold leading-snug text-slate-900">
                <TbMapPin className="mt-1 size-5 shrink-0 text-slate-400" />
                {gempa.Wilayah}
              </h2>
              <div className="mt-4">
                <PotensiBadge potensi={gempa.Potensi} />
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 border-t border-slate-100 sm:grid-cols-5">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="border-b border-r border-slate-100 p-4 last:border-r-0 sm:border-b-0"
              >
                <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon className="size-3.5" />
                  {label}
                </dt>
                <dd className="tabular mt-1 text-sm font-semibold text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {gempa.Dirasakan && (
            <div className="border-t border-slate-100 p-6">
              <h3 className="card-title">Wilayah dirasakan (skala MMI)</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {splitDirasakan(gempa.Dirasakan).map((area) => {
                  const [scale, ...name] = area.split(' ');
                  return (
                    <span
                      key={area}
                      className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 text-xs"
                    >
                      <span className="bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                        {scale}
                      </span>
                      <span className="px-2 py-1 text-slate-600">
                        {name.join(' ')}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h3 className="card-title">Peta guncangan</h3>
            <a
              href={shakemapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              <TbArrowsMaximize className="size-3.5" />
              Perbesar
            </a>
          </div>
          <a
            href={shakemapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center bg-slate-50"
          >
            <img
              src={shakemapUrl}
              alt={`Shakemap gempa ${gempa.Wilayah}`}
              className="max-h-[420px] w-full object-contain"
            />
          </a>
        </div>
      </div>

      {!Number.isNaN(coordinates.lat) && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h3 className="card-title">Lokasi episenter</h3>
            <span className="tabular text-xs text-slate-500">
              {gempa.Lintang} · {gempa.Bujur}
            </span>
          </div>
          <GempaMap
            list={[gempa]}
            className="h-80"
          />
        </div>
      )}

      <SigTable />
    </div>
  );
};

export default GempaUpdate;
