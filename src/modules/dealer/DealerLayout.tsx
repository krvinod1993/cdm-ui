import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/contexts/ThemeContext';

function DealerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    {
      label: 'Dashboard',
      to: '/dealer/dashboard',
      isActive: (pathname: string) => pathname === '/dealer/dashboard',
    },
    {
      label: 'Vehicles',
      to: '/dealer/vehicles',
      isActive: (pathname: string) =>
        pathname === '/dealer/vehicles' || (pathname.startsWith('/dealer/vehicles/') && !pathname.startsWith('/dealer/vehicles/add')),
    },
    {
      label: 'Add Vehicle',
      to: '/dealer/vehicles/add',
      isActive: (pathname: string) => pathname === '/dealer/vehicles/add',
    },
    {
      label: 'Leads',
      to: '/dealer/leads',
      isActive: (pathname: string) => pathname.startsWith('/dealer/leads'),
    },
    {
      label: 'Staff',
      to: '/dealer/staff',
      isActive: (pathname: string) => pathname.startsWith('/dealer/staff'),
    },
  ];

  const getRouteTitle = (pathname: string) => {
    if (pathname.startsWith('/dealer/dashboard')) return 'Dashboard';
    if (pathname === '/dealer/vehicles/add') return 'Add Vehicle';
    if (pathname.startsWith('/dealer/vehicles/')) return 'Edit Vehicle';
    if (pathname.startsWith('/dealer/vehicles')) return 'Vehicles';
    if (pathname.startsWith('/dealer/leads')) return 'Leads';
    if (pathname.startsWith('/dealer/staff')) return 'Staff';
    return 'Dealer Workspace';
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/dealer/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 lg:flex lg:flex-col">
        <div className="px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">CDM Platform</p>
          <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">CDM Dealer</h1>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = item.isActive(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            onClick={toggleTheme}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-rose-200 px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-6 dark:border-gray-800 dark:bg-gray-900/85">
          <div className="flex items-center justify-between rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{getRouteTitle(location.pathname)}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? 'L' : 'D'}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DealerLayout;
