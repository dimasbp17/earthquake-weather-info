import { NavLink, Link } from 'react-router-dom';
import { TbActivityHeartbeat } from 'react-icons/tb';
import RealTimeClock from '../RealTimeClock';

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/informasi-gempa', label: 'Gempa Bumi' },
  { to: '/informasi-cuaca', label: 'Cuaca' },
  { to: '/peringatan-dini', label: 'Peringatan Dini' },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <TbActivityHeartbeat className="size-5" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-900">
              Info Gempa &amp; Cuaca
            </span>
            <span className="block text-xs text-slate-500">
              Indonesia · Data BMKG
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <RealTimeClock />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
