import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function Navbar({ isDark: isDarkProp, toggleTheme: toggleThemeProp, embedded = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const token = localStorage.getItem('access_token');
  const { isDark: contextIsDark, toggleTheme: contextToggleTheme } = useTheme();
  const isDark = isDarkProp ?? contextIsDark;
  const toggleTheme = toggleThemeProp ?? contextToggleTheme;
  const customerName = customer?.name ?? customer?.full_name ?? customer?.email ?? 'Customer';
  const customerAvatar = customer?.avatar;
  const customerInitial = customerName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/dealer/login', { replace: true });
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer_access_token');
    localStorage.removeItem('customer_profile');
    setCustomer(null);
    setIsCustomerMenuOpen(false);
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `relative pb-0.5 transition-all hover:text-sky-500 dark:hover:text-sky-400 after:absolute after:left-0 after:top-full after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-sky-500 dark:after:bg-sky-400 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
      isActive
        ? 'text-sky-600 dark:text-sky-400 after:scale-x-100'
        : 'text-gray-700 dark:text-slate-200'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300'
        : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800'
    }`;

  useEffect(() => {
    const stored = localStorage.getItem('customer_profile');
    if (!stored) {
      setCustomer(null);
      return;
    }

    try {
      setCustomer(JSON.parse(stored));
    } catch {
      setCustomer(null);
    }
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('customer_profile');
      if (!stored) {
        setCustomer(null);
        return;
      }

      try {
        setCustomer(JSON.parse(stored));
      } catch {
        setCustomer(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCustomerMenuOpen(false);
  }, [location.pathname]);

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between gap-6">
        <NavLink
          to="/"
          className="shrink-0 text-xl font-semibold tracking-tight text-sky-600 dark:text-sky-400"
        >
          CDM
        </NavLink>

        <div className="hidden flex-wrap items-center justify-end gap-6 text-sm font-medium text-gray-700 dark:text-slate-200 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={linkClass}>
            Marketplace
          </NavLink>
          <NavLink to="/dealers" className={linkClass}>
            Dealers
          </NavLink>
          <NavLink to="/dealer/register" className={linkClass}>
            Dealer Register
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

          {customer && (
            <Link
              to="/wishlist"
              className="rounded-lg px-2 py-1.5 transition hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
            >
              Wishlist
            </Link>
          )}

          {customer ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCustomerMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-2.5 py-1.5 transition hover:border-gray-400 dark:border-slate-600 dark:hover:border-slate-400"
              >
                {customerAvatar ? (
                  <img
                    src={customerAvatar}
                    alt={customerName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                    {customerInitial}
                  </span>
                )}
                <span className="max-w-[120px] truncate text-sm font-medium text-gray-700 dark:text-slate-200">
                  {customerName}
                </span>
              </button>

              {isCustomerMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <Link
                    to="/profile"
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Wishlist
                  </Link>
                  <button
                    type="button"
                    onClick={handleCustomerLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg px-2 py-1.5 transition hover:text-sky-600 dark:hover:text-sky-400"
            >
              Sign In
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-lg transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? 'L' : 'D'}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? 'L' : 'D'}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 py-3 dark:border-slate-800 md:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/" className={mobileLinkClass}>
              Home
            </NavLink>
            <NavLink to="/marketplace" className={mobileLinkClass}>
              Marketplace
            </NavLink>
            <NavLink to="/dealers" className={mobileLinkClass}>
              Dealers
            </NavLink>
            <NavLink to="/dealer/register" className={mobileLinkClass}>
              Dealer Register
            </NavLink>
            {token ? (
              <>
                <NavLink to="/dealer/dashboard" className={mobileLinkClass}>
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-rose-500/60 px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10 dark:text-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/dealer/login" className={mobileLinkClass}>
                Dealer Login
              </NavLink>
            )}
            {customer ? (
              <div className="w-full rounded-lg border border-gray-200 p-2 dark:border-slate-700">
                <div className="mb-2 flex items-center gap-2 px-1">
                  {customerAvatar ? (
                    <img
                      src={customerAvatar}
                      alt={customerName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      {customerInitial}
                    </span>
                  )}
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-slate-200">
                    {customerName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">
                    Profile
                  </Link>
                  <Link to="/wishlist" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">
                    Wishlist
                  </Link>
                  <button
                    type="button"
                    onClick={handleCustomerLogout}
                    className="rounded-lg border border-rose-500/60 px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    embedded ? (
      <nav>{navContent}</nav>
    ) : (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav>{navContent}</nav>
        </div>
      </header>
    )
  );
}

export default Navbar;
