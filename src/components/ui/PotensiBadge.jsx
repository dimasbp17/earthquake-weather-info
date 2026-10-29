import { TbAlertOctagon, TbInfoCircle, TbShieldCheck } from 'react-icons/tb';
import { getPotensiTone } from '../../utils/gempa';

const TONES = {
  safe: {
    icon: TbShieldCheck,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  danger: {
    icon: TbAlertOctagon,
    className: 'bg-red-50 text-red-700 ring-red-600/20',
  },
  info: {
    icon: TbInfoCircle,
    className: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  },
};

const PotensiBadge = ({ potensi }) => {
  if (!potensi) return null;
  const tone = TONES[getPotensiTone(potensi)];
  const Icon = tone.icon;
  return (
    <span
      className={`inline-flex items-start gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tone.className}`}
    >
      <Icon className="mt-px size-3.5 shrink-0" />
      {potensi}
    </span>
  );
};

export default PotensiBadge;
