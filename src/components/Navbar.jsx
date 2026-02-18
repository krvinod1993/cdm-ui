import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/dealer/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `relative pb-0.5 transition-all hover:text-sky-500 dark:hover:text-sky-400 after:absolute after:left-0 after:top-full after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-sky-500 dark:after:bg-sky-400 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
      isActive
        ? 'text-sky-600 dark:text-sky-400 after:scale-x-100'
        : 'text-gray-700 dark:text-slate-200'
    }`;

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink
          to="/"
          className="text-xl font-semibold tracking-tight text-sky-600 dark:text-sky-400"
        >
          CDM
        </NavLink>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-slate-200">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/inventory" className={linkClass}>
            Inventory
          </NavLink>
          <NavLink to="/dealers" className={linkClass}>
            Dealers
          </NavLink>

          {token ? (
            <>
              <NavLink to="/dealer/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-lg border border-rose-500/60 px-4 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/dealer/login"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-slate-50'
                }`
              }
            >
              Dealer Login
            </NavLink>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-lg transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
