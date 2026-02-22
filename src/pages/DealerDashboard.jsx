import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

function DealerDashboard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/vehicles')
      .then((data) => {
        console.log('[DealerDashboard] vehicles response:', data);
        const list = Array.isArray(data.items) ? data.items : [];
        setVehicles(list);
      })
      .catch((err) => {
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/dealer/login', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  /* ── Status filter state ──────────────────────────────── */
  const [statusFilter, setStatusFilter] = useState('all');

  /* ── Computed stats (from backend status field) ──────── */
  const totalVehicles = vehicles.length;
  const activeVehicles = useMemo(() => vehicles.filter((v) => v.status === 'active').length, [vehicles]);
  const inactiveVehicles = useMemo(() => vehicles.filter((v) => v.status === 'inactive').length, [vehicles]);
  const soldVehicles = useMemo(() => vehicles.filter((v) => v.status === 'sold').length, [vehicles]);
  const draftVehicles = useMemo(() => vehicles.filter((v) => v.status === 'draft').length, [vehicles]);

  const totalValue = useMemo(
    () => vehicles.reduce((sum, v) => sum + (v.price || 0), 0),
    [vehicles],
  );

  /* ── Filtered vehicles for table ────────────────────── */
  const filteredVehicles = useMemo(
    () => (statusFilter === 'all' ? vehicles : vehicles.filter((v) => v.status === statusFilter)),
    [vehicles, statusFilter],
  );

  /* ── Stat cards config ──────────────────────────────── */
  const stats = [
    {
      label: 'Total Vehicles',
      value: String(totalVehicles),
      color: 'sky',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
        </svg>
      ),
    },
    {
      label: 'Active',
      value: String(activeVehicles),
      color: 'emerald',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Inactive',
      value: String(inactiveVehicles),
      color: 'gray',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      label: 'Sold',
      value: String(soldVehicles),
      color: 'rose',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
    },
    {
      label: 'Drafts',
      value: String(draftVehicles),
      color: 'amber',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
    },
  ];

  /* ── Color system ───────────────────────────────────── */
  const palette = {
    sky:     { iconBg: 'bg-sky-100 dark:bg-sky-500/15',       iconText: 'text-sky-600 dark:text-sky-400',       glow: 'group-hover:shadow-sky-500/10'     },
    emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-500/15', iconText: 'text-emerald-600 dark:text-emerald-400', glow: 'group-hover:shadow-emerald-500/10' },
    gray:    { iconBg: 'bg-gray-100 dark:bg-gray-600/20',       iconText: 'text-gray-500 dark:text-gray-400',       glow: 'group-hover:shadow-gray-500/10'    },
    rose:    { iconBg: 'bg-rose-100 dark:bg-rose-500/15',       iconText: 'text-rose-600 dark:text-rose-400',       glow: 'group-hover:shadow-rose-500/10'     },
    amber:   { iconBg: 'bg-amber-100 dark:bg-amber-500/15',     iconText: 'text-amber-600 dark:text-amber-400',     glow: 'group-hover:shadow-amber-500/10'   },
  };

  /* ── Status badge helper ────────────────────────────── */
  const statusStyles = {
    active:   { bg: 'bg-emerald-100 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500 dark:bg-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-500/20', label: 'Active'   },
    inactive: { bg: 'bg-gray-100 dark:bg-gray-600/15',       text: 'text-gray-600 dark:text-gray-400',       dot: 'bg-gray-400 dark:bg-gray-500',       ring: 'ring-gray-200 dark:ring-gray-600/30',       label: 'Inactive' },
    sold:     { bg: 'bg-rose-100 dark:bg-rose-500/10',       text: 'text-rose-700 dark:text-rose-400',       dot: 'bg-rose-500 dark:bg-rose-400',       ring: 'ring-rose-200 dark:ring-rose-500/20',       label: 'Sold'     },
    draft:    { bg: 'bg-amber-100 dark:bg-amber-500/10',     text: 'text-amber-700 dark:text-amber-400',     dot: 'bg-amber-500 dark:bg-amber-400',     ring: 'ring-amber-200 dark:ring-amber-500/20',     label: 'Draft'    },
  };

  const getStatusBadge = (vehicleStatus) => {
    const s = statusStyles[vehicleStatus];
    if (s) {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${s.bg} ${s.text} ${s.ring}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 ring-1 ring-gray-200 dark:bg-gray-600/15 dark:text-gray-400 dark:ring-gray-600/30">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
        {vehicleStatus || 'Unknown'}
      </span>
    );
  };

  /* ── Skeleton loader ────────────────────────────────── */
  const CardSkeleton = () => (
    <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
  );

  const TableRowSkeleton = () => (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </td>
      ))}
    </tr>
  );

  /* ── Greeting ───────────────────────────────────────── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="mx-auto max-w-7xl space-y-10">

      {/* ════ HERO HEADER ══════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-8 shadow-sm sm:p-10 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/80 dark:shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/[0.04] blur-3xl dark:bg-sky-500/[0.07]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-500/[0.03] blur-3xl dark:bg-violet-500/[0.05]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{greeting}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Dealer Dashboard
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
              Manage your inventory, track performance, and grow your dealership.
            </p>
          </div>

          <Link
            to="/dealer/vehicles/add"
            className="group relative inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30"
          >
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Vehicle
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>

        {!loading && totalVehicles > 0 && (
          <div className="relative mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Portfolio Value</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ₹{new Intl.NumberFormat('en-IN').format(totalValue)}
              </span>
            </div>
            <div className="hidden h-4 w-px bg-gray-200 sm:block dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Vehicles</span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalVehicles}</span>
            </div>
          </div>
        )}
      </div>

      {/* ════ STAT CARDS ═══════════════════════════════ */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Overview</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {stats.map((stat) => {
            const p = palette[stat.color];
            return (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-2xl ${p.glow}`}
              >
                <div className="relative flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.iconBg} ${p.iconText}`}>
                    {stat.icon}
                  </div>
                </div>

                <div className="relative mt-4">
                  {loading ? (
                    <CardSkeleton />
                  ) : (
                    <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════ INVENTORY TABLE ══════════════════════════ */}
      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Recent Inventory</h2>
            <div className="hidden h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent sm:block dark:from-gray-700" />
          </div>

          <div className="flex items-center gap-3">
            {!loading && vehicles.length > 0 && (
              <select
                id="dash-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm outline-none transition-all focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="all">All Statuses ({totalVehicles})</option>
                <option value="active">Active ({activeVehicles})</option>
                <option value="inactive">Inactive ({inactiveVehicles})</option>
                <option value="sold">Sold ({soldVehicles})</option>
                <option value="draft">Draft ({draftVehicles})</option>
              </select>
            )}

            {!loading && vehicles.length > 0 && (
              <Link
                to="/dealer/vehicles"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-sky-600 shadow-sm transition-all hover:border-sky-500/30 hover:bg-sky-50 dark:border-gray-600 dark:bg-gray-800 dark:text-sky-400 dark:hover:bg-sky-500/5"
              >
                View All
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Vehicle', 'Brand', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[...Array(3)].map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty — no vehicles */}
        {!loading && vehicles.length === 0 && (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600">
              <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-200">No vehicles in your inventory</p>
              <p className="mt-1.5 text-sm text-gray-400 dark:text-gray-500">Get started by adding your first vehicle listing.</p>
            </div>
            <Link to="/dealer/vehicles/add" className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Your First Vehicle
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && vehicles.length > 0 && filteredVehicles.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-700">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-300">Vehicle</th>
                    <th className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 sm:table-cell dark:text-gray-300">Brand</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-300">Price</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredVehicles.slice(0, 5).map((vehicle) => {
                    const imgSrc = vehicle.image_url
                      ? `${BACKEND_URL}/${vehicle.image_url.replace(/^\//, '')}`
                      : null;
                    return (
                      <tr key={vehicle.id} className="group transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600">
                              {imgSrc ? (
                                <img src={imgSrc} alt={`${vehicle.brand} ${vehicle.name}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 dark:text-gray-500">🚗</div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white">{vehicle.name}</p>
                              <p className="mt-0.5 text-xs text-gray-400 sm:hidden dark:text-gray-500">{vehicle.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 text-gray-500 sm:table-cell dark:text-gray-400">{vehicle.brand}</td>
                        <td className="px-6 py-4"><span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">₹{new Intl.NumberFormat('en-IN').format(vehicle.price)}</span></td>
                        <td className="px-6 py-4">{getStatusBadge(vehicle.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/dealer/vehicles/${vehicle.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition-all hover:border-sky-300 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/5 dark:text-sky-400 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                              Edit
                            </Link>
                            <Link to={`/vehicles/${vehicle.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-3.5 sm:flex-row dark:border-gray-700 dark:bg-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-300">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-100">{Math.min(filteredVehicles.length, 5)}</span> of{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-100">{filteredVehicles.length}</span>{' '}
                {statusFilter !== 'all' ? `${statusFilter} ` : ''}vehicles
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-300">
                Total value: <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{new Intl.NumberFormat('en-IN').format(totalValue)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Filtered empty */}
        {!loading && vehicles.length > 0 && filteredVehicles.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600">
              <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">No <span className="capitalize text-gray-900 dark:text-gray-100">{statusFilter}</span> vehicles found</p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Try adjusting the filter to see more results.</p>
            </div>
            <button onClick={() => setStatusFilter('all')} className="mt-1 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Clear Filter
            </button>
          </div>
        )}
      </section>

      {/* ════ QUICK ACTIONS ════════════════════════════ */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Quick Actions</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/dealer/vehicles/add" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-500/30 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/[0.05] blur-2xl transition-all duration-500 group-hover:bg-emerald-500/[0.12]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 transition-all group-hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20 dark:group-hover:bg-emerald-500/15 dark:group-hover:ring-emerald-500/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white">Add a New Vehicle</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">List a new vehicle in your inventory</p>
              </div>
            </div>
          </Link>

          <Link to="/dealer/vehicles" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-sky-500/30 dark:hover:shadow-2xl dark:hover:shadow-sky-500/5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/[0.05] blur-2xl transition-all duration-500 group-hover:bg-sky-500/[0.12]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 ring-1 ring-sky-200 transition-all group-hover:bg-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20 dark:group-hover:bg-sky-500/15 dark:group-hover:ring-sky-500/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white">View My Vehicles</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Manage your existing listings</p>
              </div>
            </div>
          </Link>

          <Link to="/dealer/dashboard" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-500/30 dark:hover:shadow-2xl dark:hover:shadow-violet-500/5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/[0.05] blur-2xl transition-all duration-500 group-hover:bg-violet-500/[0.12]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 ring-1 ring-violet-200 transition-all group-hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20 dark:group-hover:bg-violet-500/15 dark:group-hover:ring-violet-500/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white">Analytics</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Track your dealership performance</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DealerDashboard;
