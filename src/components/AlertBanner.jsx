import { Link } from 'react-router-dom';
import { TbAlertTriangle, TbArrowRight } from 'react-icons/tb';

// Ringkasan peringatan dini; `title` menjelaskan cakupan (nasional / provinsi).
const AlertBanner = ({ alerts, title }) => {
  if (!alerts.length) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
          <TbAlertTriangle className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
            {alerts
              .slice(0, 3)
              .map((alert) => alert.title)
              .join(' · ')}
            {alerts.length > 3 && ` · dan ${alerts.length - 3} lainnya`}
          </p>
        </div>
      </div>
      <Link
        to="/peringatan-dini"
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-orange-200 hover:bg-orange-50 sm:self-auto"
      >
        Lihat peringatan
        <TbArrowRight className="size-4" />
      </Link>
    </div>
  );
};

export default AlertBanner;
