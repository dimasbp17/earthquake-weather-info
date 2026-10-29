import { useMemo, useState } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { TbRefresh, TbSearch } from 'react-icons/tb';
import PageHeader from '../../components/PageHeader';
import BaseMap, { FitBounds } from '../../components/map/BaseMap';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/ui/StatusState';
import useAlerts from '../../hooks/useAlerts';
import { SEVERITY, getSeverity } from '../../utils/peringatan';
import AlertCard from './_partials/AlertCard';

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="tabular mt-2 text-2xl font-semibold tracking-tight text-slate-900">
      {value}
    </p>
  </div>
);

const PeringatanDini = () => {
  const { alerts, loading, error, updatedAt, refetch } = useAlerts({
    withDetails: true,
  });
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alerts;
    return alerts.filter((alert) =>
      `${alert.title} ${alert.description}`.toLowerCase().includes(q)
    );
  }, [alerts, query]);

  const selected = filtered.find((alert) => alert.file === selectedFile);
  const focusPoints = (selected ? [selected] : filtered).flatMap(
    (alert) => alert.detail?.polygons.flat() ?? []
  );

  const provinces = new Set(alerts.map((alert) => alert.province)).size;
  const highest = alerts.reduce(
    (max, alert) => {
      const severity = getSeverity(alert.detail?.severity);
      return severity.rank > max.rank ? severity : max;
    },
    { rank: 0, label: '-' }
  );

  return (
    <>
      <PageHeader
        eyebrow="Peringatan dini"
        title="Peringatan Dini Cuaca"
        description="Peringatan cuaca ekstrem jangka pendek (nowcasting) yang sedang berlaku di Indonesia, diterbitkan langsung oleh BMKG."
        image="/assets/images/climate.jpg"
      />

      <div className="container-page space-y-6 py-8">
        {loading && !alerts.length ? (
          <LoadingState label="Memuat peringatan dini…" />
        ) : error && !alerts.length ? (
          <div className="card">
            <ErrorState
              message="Peringatan dini belum dapat dimuat. Pastikan proxy /api/bmkg-alerts aktif."
              onRetry={refetch}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Peringatan aktif"
                value={alerts.length}
              />
              <StatCard
                label="Provinsi terdampak"
                value={provinces}
              />
              <StatCard
                label="Tingkat tertinggi"
                value={highest.label}
              />
              <StatCard
                label="Diperbarui"
                value={
                  updatedAt
                    ? updatedAt.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'
                }
              />
            </div>

            {alerts.length === 0 ? (
              <div className="card">
                <EmptyState message="Tidak ada peringatan dini cuaca yang berlaku saat ini." />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="card sticky top-20 overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <h3 className="card-title">Area terdampak</h3>
                      {selected && (
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-900"
                        >
                          Tampilkan semua
                        </button>
                      )}
                    </div>
                    <BaseMap className="h-[520px]">
                      <FitBounds
                        points={focusPoints}
                        maxZoom={9}
                      />
                      {filtered.flatMap((alert) =>
                        (alert.detail?.polygons ?? []).map((polygon, i) => {
                          const severity = getSeverity(alert.detail.severity);
                          const dimmed =
                            selected && selected.file !== alert.file;
                          return (
                            <Polygon
                              key={`${alert.file}-${i}`}
                              positions={polygon}
                              eventHandlers={{
                                click: () => setSelectedFile(alert.file),
                              }}
                              pathOptions={{
                                color: severity.hex,
                                weight: 1,
                                fillColor: severity.hex,
                                fillOpacity: dimmed ? 0.08 : 0.35,
                                opacity: dimmed ? 0.3 : 1,
                              }}
                            >
                              <Tooltip sticky>{alert.title}</Tooltip>
                            </Polygon>
                          );
                        })
                      )}
                    </BaseMap>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
                      {Object.values(SEVERITY)
                        .reverse()
                        .map((severity) => (
                          <span
                            key={severity.label}
                            className="inline-flex items-center gap-1.5"
                          >
                            <span
                              className="size-2.5 rounded-sm"
                              style={{ backgroundColor: severity.hex }}
                            />
                            {severity.label}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <label className="relative block flex-1">
                      <TbSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari provinsi atau kecamatan…"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={refetch}
                      title="Muat ulang"
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <TbRefresh
                        className={`size-4 ${loading ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="card">
                      <EmptyState message="Tidak ada peringatan yang cocok." />
                    </div>
                  ) : (
                    filtered.map((alert) => (
                      <AlertCard
                        key={alert.file}
                        alert={alert}
                        selected={alert.file === selectedFile}
                        onSelect={() => setSelectedFile(alert.file)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PeringatanDini;
