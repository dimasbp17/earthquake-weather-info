import { useMemo, useState } from 'react';
import { TbRefresh, TbSearch } from 'react-icons/tb';
import useFetch from '../../../hooks/useFetch';
import { BMKG_TEWS_URL, splitDirasakan } from '../../../utils/gempa';
import MagnitudeBadge from '../../../components/ui/MagnitudeBadge';
import PotensiBadge from '../../../components/ui/PotensiBadge';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/ui/StatusState';
import GempaMap from './GempaMap';

const StatCard = ({ label, value, hint }) => (
  <div className="card p-5">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="tabular mt-2 text-2xl font-semibold tracking-tight text-slate-900">
      {value}
    </p>
    {hint && <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>}
  </div>
);

// Tabel daftar gempa; `variant` menentukan kolom terakhir (Potensi / Dirasakan).
const EarthquakeTable = ({ endpoint, title, description, variant }) => {
  const { data, loading, error, updatedAt, refetch } = useFetch(
    `${BMKG_TEWS_URL}/${endpoint}`,
    { refreshInterval: 5 * 60000 }
  );
  const [query, setQuery] = useState('');

  const list = useMemo(() => data?.Infogempa?.gempa ?? [], [data]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((gempa) =>
      `${gempa.Wilayah} ${gempa.Dirasakan ?? ''}`.toLowerCase().includes(q)
    );
  }, [list, query]);

  const stats = useMemo(() => {
    if (!list.length) return null;
    const strongest = list.reduce((a, b) =>
      parseFloat(b.Magnitude) > parseFloat(a.Magnitude) ? b : a
    );
    const shallowest = list.reduce((a, b) =>
      parseFloat(b.Kedalaman) < parseFloat(a.Kedalaman) ? b : a
    );
    const avg =
      list.reduce((sum, g) => sum + parseFloat(g.Magnitude), 0) / list.length;
    return { strongest, shallowest, avg };
  }, [list]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Jumlah kejadian"
            value={list.length}
            hint="Dalam daftar terbaru BMKG"
          />
          <StatCard
            label="Magnitudo terbesar"
            value={`M ${stats.strongest.Magnitude}`}
            hint={stats.strongest.Wilayah}
          />
          <StatCard
            label="Rata-rata magnitudo"
            value={`M ${stats.avg.toFixed(1)}`}
          />
          <StatCard
            label="Kedalaman terdangkal"
            value={stats.shallowest.Kedalaman}
            hint={stats.shallowest.Wilayah}
          />
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <h3 className="card-title">Peta sebaran</h3>
          <span className="text-xs text-slate-500">
            Klik titik untuk detail · lingkaran bertepi gelap = terbaru
          </span>
        </div>
        <GempaMap
          list={filtered}
          className="h-[420px]"
          maxZoom={7}
          highlightFirst
        />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 p-6 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative block">
              <TbSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari wilayah…"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 md:w-64"
              />
            </label>
            <button
              type="button"
              onClick={refetch}
              title={
                updatedAt
                  ? `Diperbarui ${updatedAt.toLocaleTimeString('id-ID')}`
                  : 'Muat ulang'
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <TbRefresh className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            message={query ? 'Tidak ada gempa yang cocok.' : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="w-12 px-6 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Magnitudo</th>
                  <th className="px-4 py-3 font-semibold">Kedalaman</th>
                  <th className="px-4 py-3 font-semibold">Lokasi</th>
                  <th className="px-6 py-3 font-semibold">
                    {variant === 'dirasakan' ? 'Dirasakan (MMI)' : 'Potensi'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((gempa, index) => (
                  <tr
                    key={gempa.DateTime ?? index}
                    className="align-top transition-colors hover:bg-slate-50/70"
                  >
                    <td className="tabular px-6 py-4 text-slate-400">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {gempa.Tanggal}
                      </div>
                      <div className="tabular text-xs text-slate-500">
                        {gempa.Jam}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <MagnitudeBadge magnitude={gempa.Magnitude} />
                    </td>
                    <td className="tabular whitespace-nowrap px-4 py-4 text-slate-700">
                      {gempa.Kedalaman}
                    </td>
                    <td className="max-w-xs px-4 py-4">
                      <div className="text-slate-800">{gempa.Wilayah}</div>
                      <div className="tabular mt-0.5 text-xs text-slate-500">
                        {gempa.Lintang} · {gempa.Bujur}
                      </div>
                    </td>
                    <td className="max-w-sm px-6 py-4">
                      {variant === 'dirasakan' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {splitDirasakan(gempa.Dirasakan).map((area) => (
                            <span
                              key={area}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <PotensiBadge potensi={gempa.Potensi} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthquakeTable;
