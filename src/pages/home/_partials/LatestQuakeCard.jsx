import { Link } from 'react-router-dom';
import { TbArrowRight, TbMapPin } from 'react-icons/tb';
import useFetch from '../../../hooks/useFetch';
import {
  BMKG_TEWS_URL,
  formatRelativeTime,
  getMagnitudeLevel,
} from '../../../utils/gempa';
import PotensiBadge from '../../../components/ui/PotensiBadge';

const LatestQuakeCard = () => {
  const { data, loading, error } = useFetch(
    `${BMKG_TEWS_URL}/autogempa.json`,
    { refreshInterval: 60000 }
  );
  const gempa = data?.Infogempa?.gempa;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Gempa terbaru
        </p>
        {gempa && (
          <span className="text-xs text-slate-400">
            {formatRelativeTime(gempa.DateTime)}
          </span>
        )}
      </div>

      {loading && !gempa && (
        <div className="mt-6 space-y-3">
          <div className="h-12 w-32 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      )}

      {error && !gempa && (
        <p className="mt-6 text-sm text-slate-400">
          Data gempa belum dapat dimuat.
        </p>
      )}

      {gempa && (
        <>
          <div className="mt-5 flex items-end gap-4">
            <div className="tabular text-6xl font-semibold leading-none tracking-tight">
              {gempa.Magnitude}
            </div>
            <div className="pb-1">
              <span
                className={`inline-block size-2 rounded-full ${getMagnitudeLevel(gempa.Magnitude).solid}`}
              />{' '}
              <span className="text-sm text-slate-300">
                Magnitudo · {getMagnitudeLevel(gempa.Magnitude).label}
              </span>
            </div>
          </div>

          <p className="mt-5 flex gap-2 text-sm leading-relaxed text-slate-200">
            <TbMapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
            {gempa.Wilayah}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-5 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Waktu</dt>
              <dd className="tabular mt-1 font-medium">{gempa.Jam}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Tanggal</dt>
              <dd className="mt-1 font-medium">{gempa.Tanggal}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Kedalaman</dt>
              <dd className="tabular mt-1 font-medium">{gempa.Kedalaman}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <PotensiBadge potensi={gempa.Potensi} />
          </div>

          <Link
            to="/informasi-gempa"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-300 hover:text-teal-200"
          >
            Detail gempa
            <TbArrowRight className="size-4" />
          </Link>
        </>
      )}
    </div>
  );
};

export default LatestQuakeCard;
