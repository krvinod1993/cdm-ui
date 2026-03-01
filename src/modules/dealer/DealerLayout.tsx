import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/contexts/ThemeContext';

function DealerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    // Close mobile drawer on route change to keep navigation flow clean.
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">CDM Platform</p>
        <h1 className="mt-2 text-xl font-semibold text-white">CDM Dealer</h1>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const active = item.isActive(location.pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-gray-700 pt-4">
        <button
          onClick={toggleTheme}
          className="w-full rounded-xl border border-gray-700 px-3 py-2.5 text-left text-sm font-medium text-gray-200 transition hover:bg-white/10"
        >
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-rose-500/30 px-3 py-2.5 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <aside className="hidden md:flex md:w-64 md:flex-col bg-gray-900">
        <div className="flex h-full flex-col border-r border-gray-700 px-4 py-6">
          {sidebarContent}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 transition-transform duration-300 md:hidden border-r border-gray-700 px-4 py-6 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="mb-4 inline-flex items-center justify-center self-end rounded-lg border border-gray-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-200 transition hover:bg-white/10"
          type="button"
        >
          Close
        </button>
        {sidebarContent}
      </aside>

      <div className="flex flex-1 flex-col w-0">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900/85">
          <div className="flex items-center justify-between rounded-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 md:hidden dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                type="button"
                aria-label="Open sidebar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{getRouteTitle(location.pathname)}</h2>
            </div>
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

        <main className="flex-1 p-4 sm:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DealerLayout;
