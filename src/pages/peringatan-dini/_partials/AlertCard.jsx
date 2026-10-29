import { useState } from 'react';
import { TbClockHour4, TbExternalLink, TbMapPin } from 'react-icons/tb';
import {
  formatAlertTime,
  getSeverity,
  parseDescription,
} from '../../../utils/peringatan';

const MAX_DISTRICTS = 8;

const AlertCard = ({ alert, selected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const { districts, dampak } = parseDescription(alert.description);
  const detail = alert.detail;
  const severity = getSeverity(detail?.severity);
  const shownDistricts = expanded ? districts : districts.slice(0, MAX_DISTRICTS);

  return (
    <article
      className={`card cursor-pointer border-l-4 p-5 transition ${
        selected ? 'ring-2 ring-slate-900/10' : 'hover:border-slate-300'
      }`}
      style={{ borderLeftColor: severity.hex }}
      onClick={onSelect}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{alert.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <TbClockHour4 className="size-3.5" />
              {detail
                ? `${formatAlertTime(detail.effective)} – ${formatAlertTime(
                    detail.expires
                  )}`
                : formatAlertTime(alert.pubDate)}
            </span>
            {detail?.event && <span>{detail.event}</span>}
          </p>
        </div>
        {detail && (
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${severity.badge}`}
          >
            {severity.label}
          </span>
        )}
      </div>

      {districts.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <TbMapPin className="size-3.5" />
            {districts.length} kecamatan terdampak
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {shownDistricts.map((district) => (
              <span
                key={district}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700"
              >
                {district.toLowerCase()}
              </span>
            ))}
            {districts.length > MAX_DISTRICTS && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((value) => !value);
                }}
                className="rounded-md px-2 py-0.5 text-xs font-medium text-teal-700 hover:bg-teal-50"
              >
                {expanded
                  ? 'Tampilkan lebih sedikit'
                  : `+${districts.length - MAX_DISTRICTS} lainnya`}
              </button>
            )}
          </div>
        </div>
      )}

      {dampak && (
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Potensi dampak:</span>{' '}
          {dampak}.
        </p>
      )}

      {detail?.infografis && (
        <a
          href={detail.infografis}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
        >
          Lihat infografis BMKG
          <TbExternalLink className="size-4" />
        </a>
      )}
    </article>
  );
};

export default AlertCard;
