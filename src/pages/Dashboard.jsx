import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsToday, setLeadsToday] = useState(0);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    api('/vehicles')
      .then((data) => {
        console.log('[Dashboard] vehicles response:', data);
        const list = Array.isArray(data.items) ? data.items : [];
        setVehicles(list);
      })
      .catch(() => setVehicles([]))
      .finally(() => setVehiclesLoading(false));

    api('/lead-stats')
      .then((data) => {
        console.log('[Dashboard] lead-stats response:', data);
        setTotalLeads(data.total ?? 0);
        setLeadsToday(data.today ?? 0);
      })
      .catch(() => {
        setTotalLeads(0);
        setLeadsToday(0);
      })
      .finally(() => setLeadsLoading(false));
  }, []);

  /* ── Summary stats ─────────────────────────────────── */
  const totalVehicles = vehicles.length;

  const summaryLoading = vehiclesLoading || leadsLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-10">

      {/* ════ HEADER ═══════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-8 shadow-sm sm:p-10 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/80 dark:shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/[0.04] blur-3xl dark:bg-sky-500/[0.07]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-500/[0.03] blur-3xl dark:bg-violet-500/[0.05]" />

        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            Dealer Dashboard
          </h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
            Overview of your vehicles and customer leads.
          </p>
        </div>
      </div>

      {/* ════ SUMMARY CARDS ═════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Vehicles */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-500/[0.06] blur-2xl dark:bg-sky-500/[0.1]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
              </svg>
            </div>
            <div>
              {summaryLoading ? (
                <div className="h-8 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{totalVehicles}</p>
              )}
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Vehicles</p>
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-500/[0.06] blur-2xl dark:bg-amber-500/[0.1]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div>
              {summaryLoading ? (
                <div className="h-8 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{totalLeads}</p>
              )}
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Leads</p>
            </div>
          </div>
        </div>

        {/* Leads Today */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/[0.06] blur-2xl dark:bg-emerald-500/[0.1]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              {summaryLoading ? (
                <div className="h-8 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              ) : (
                <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{leadsToday}</p>
              )}
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Leads Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SECTION 1 — MY VEHICLES ════════════════════ */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              My Vehicles
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
          </div>
          {!vehiclesLoading && vehicles.length > 0 && (
            <Link
              to="/dealer/vehicles"
              className="text-xs font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            >
              View all →
            </Link>
          )}
        </div>

        {/* Loading */}
        {vehiclesLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-gray-600 dark:border-t-sky-400" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Loading vehicles…</span>
          </div>
        )}

        {/* Empty state */}
        {!vehiclesLoading && vehicles.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
              <svg className="h-7 w-7 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No vehicles listed yet. Add your first vehicle to get started.
            </p>
            <Link
              to="/dealer/vehicles/add"
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Vehicle
            </Link>
          </div>
        )}

        {/* Vehicles grid */}
        {!vehiclesLoading && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 6).map((vehicle) => {
              const imgSrc = vehicle.image_url
                ? `${BACKEND_URL}/${vehicle.image_url.replace(/^\//, '')}`
                : null;
              return (
                <Link
                  key={vehicle.id}
                  to={`/dealer/vehicles/${vehicle.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-sky-500/30 dark:hover:shadow-lg"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600">
                    {imgSrc ? (
                      <img src={imgSrc} alt={`${vehicle.brand} ${vehicle.name}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg text-gray-400 dark:text-gray-500">🚗</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{vehicle.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{vehicle.brand}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{new Intl.NumberFormat('en-IN').format(vehicle.price)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ════ SECTION 2 — MY LEADS ══════════════════════ */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              My Leads
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
          </div>
          {!leadsLoading && totalLeads > 0 && (
            <Link
              to="/dealer/leads"
              className="text-xs font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            >
              View all →
            </Link>
          )}
        </div>

        {/* Loading */}
        {leadsLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500 dark:border-gray-600 dark:border-t-amber-400" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Loading leads…</span>
          </div>
        )}

        {/* Empty state */}
        {!leadsLoading && totalLeads === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
              <svg className="h-7 w-7 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No leads yet.
            </p>
          </div>
        )}

        {/* Leads summary */}
        {!leadsLoading && totalLeads > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Total Leads card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-500/[0.06] blur-2xl dark:bg-amber-500/[0.1]" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{totalLeads}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Leads</p>
                </div>
              </div>
            </div>

            {/* Leads Today card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/[0.06] blur-2xl dark:bg-emerald-500/[0.1]" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{leadsToday}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Leads Today</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
