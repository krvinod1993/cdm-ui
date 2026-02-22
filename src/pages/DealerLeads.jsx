import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CLOSED'];

const statusStyle = {
  NEW: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20',
  CONTACTED:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  CLOSED:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DealerLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  /* ── Fetch leads ──────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('/my-leads');
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /* ── Status update ────────────────────────────────────── */
  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    setError(null);
    try {
      console.log(`[DealerLeads] Updating lead ${leadId} → ${newStatus}`);
      const response = await api(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      console.log('[DealerLeads] Status update response:', response);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
      );
    } catch (err) {
      console.error('[DealerLeads] Status update error:', err);
      setError(`Failed to update lead status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Stats ────────────────────────────────────────────── */
  const counts = useMemo(() => {
    const c = { NEW: 0, CONTACTED: 0, CLOSED: 0 };
    leads.forEach((l) => {
      const s = (l.status || 'NEW').toUpperCase();
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [leads]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-8 shadow-sm sm:p-10 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/80 dark:shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/[0.04] blur-3xl dark:bg-amber-500/[0.07]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Leads
            </h1>
            <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'} total
            </p>
          </div>

          {/* Mini stat pills */}
          {!loading && leads.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <span
                  key={s}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle[s]}`}
                >
                  {s}
                  <span className="ml-0.5 rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-bold tabular-nums dark:bg-white/5">
                    {counts[s]}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-20 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-gray-600 dark:border-t-sky-400" />
          <span className="text-sm text-gray-400 dark:text-gray-500">Loading leads…</span>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────── */}
      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
          <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
          <button
            type="button"
            onClick={fetchLeads}
            className="mt-3 text-sm font-semibold text-rose-600 transition hover:text-rose-700 hover:underline dark:text-rose-400"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────── */}
      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20">
            <svg className="h-8 w-8 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
          </div>
          <p className="font-medium text-gray-700 dark:text-gray-300">No leads yet</p>
          <p className="mt-1 max-w-sm text-sm text-gray-400 dark:text-gray-500">
            When customers enquire about your vehicles, their leads will appear here.
          </p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────── */}
      {!loading && !error && leads.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/80">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Name
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Phone
                  </th>
                  <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell dark:text-gray-500">
                    Message
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Vehicle
                  </th>
                  <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell dark:text-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {leads.map((lead) => {
                  const currentStatus = (lead.status || 'NEW').toUpperCase();
                  const isUpdating = updatingId === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      className="bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900/40 dark:hover:bg-gray-800/50"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold uppercase text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                            {(lead.name || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                              {lead.name}
                            </p>
                            {lead.email && (
                              <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                                {lead.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1.5 text-sm text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                          {lead.phone}
                        </a>
                      </td>

                      {/* Message */}
                      <td className="hidden max-w-[220px] px-5 py-4 md:table-cell">
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {lead.message || '—'}
                        </p>
                      </td>

                      {/* Vehicle */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {lead.vehicle_title || lead.car_title || `#${lead.vehicle_id || lead.car_id || '—'}`}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(lead.created_at)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={currentStatus}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`cursor-pointer appearance-none rounded-full py-1.5 pl-3 pr-8 text-xs font-semibold ring-1 outline-none transition focus:ring-2 disabled:cursor-wait disabled:opacity-60 ${statusStyle[currentStatus] || statusStyle.NEW}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {/* Dropdown chevron */}
                          <svg
                            className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DealerLeads;
