import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

function Dashboard() {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    api('/my-cars')
      .then((data) => setCars(data))
      .catch(() => setCars([]))
      .finally(() => setCarsLoading(false));

    api('/my-leads')
      .then((data) => setLeads(data))
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, []);

  /* ── Summary stats ─────────────────────────────────── */
  const totalCars = cars.length;
  const totalLeads = leads.length;
  const leadsToday = useMemo(() => {
    const today = new Date().toDateString();
    return leads.filter((l) => new Date(l.created_at).toDateString() === today).length;
  }, [leads]);

  const summaryLoading = carsLoading || leadsLoading;

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
            Overview of your cars and customer leads.
          </p>
        </div>
      </div>

      {/* ════ SUMMARY CARDS ═════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Cars */}
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
                <p className="text-3xl font-extrabold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{totalCars}</p>
              )}
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total Cars</p>
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

      {/* ════ SECTION 1 — MY CARS ═══════════════════════ */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            My Cars
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
            <svg className="h-7 w-7 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Your car listings will appear here.
          </p>
        </div>
      </section>

      {/* ════ SECTION 2 — MY LEADS ══════════════════════ */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            My Leads
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
        </div>

        {/* Loading */}
        {leadsLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-16 shadow-sm dark:border-gray-600 dark:bg-gray-800">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500 dark:border-gray-600 dark:border-t-amber-400" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Loading leads…</span>
          </div>
        )}

        {/* Empty state */}
        {!leadsLoading && leads.length === 0 && (
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

        {/* Leads list */}
        {!leadsLoading && leads.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                {/* Car title */}
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                  {lead.car_title}
                </p>

                {/* Customer name */}
                <p className="mt-2 text-base font-bold text-gray-900 dark:text-gray-100">
                  {lead.name}
                </p>

                {/* Phone */}
                <a
                  href={`tel:${lead.phone}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {lead.phone}
                </a>

                {/* Message */}
                {lead.message && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {lead.message}
                  </p>
                )}

                {/* Date */}
                <p className="mt-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
