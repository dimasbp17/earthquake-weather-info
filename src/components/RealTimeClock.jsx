import { useEffect, useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right leading-tight">
      <div className="tabular text-sm font-semibold text-slate-900">
        {timeFormatter.format(currentTime).replace(/\./g, ':')}
      </div>
      <div className="text-xs text-slate-500">
        {dateFormatter.format(currentTime)}
      </div>
    </div>
  );
};

export default RealTimeClock;
