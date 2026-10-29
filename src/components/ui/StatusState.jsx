import { TbAlertTriangle, TbInbox, TbRefresh } from 'react-icons/tb';

export const LoadingState = ({ label = 'Memuat data…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500">
    <span className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
    {label}
  </div>
);

export const ErrorState = ({
  message = 'Gagal memuat data dari BMKG.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-sm text-slate-500">
    <span className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600">
      <TbAlertTriangle className="size-5" />
    </span>
    <p>{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
      >
        <TbRefresh className="size-4" />
        Coba lagi
      </button>
    )}
  </div>
);

export const EmptyState = ({ message = 'Data belum tersedia.' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500">
    <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <TbInbox className="size-5" />
    </span>
    {message}
  </div>
);
