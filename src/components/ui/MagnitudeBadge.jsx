import { getMagnitudeLevel } from '../../utils/gempa';

const MagnitudeBadge = ({ magnitude, showLabel = false }) => {
  const level = getMagnitudeLevel(magnitude);
  return (
    <span
      className={`tabular inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${level.badge}`}
      title={level.label}
    >
      M {magnitude}
      {showLabel && <span className="font-medium">· {level.label}</span>}
    </span>
  );
};

export default MagnitudeBadge;
