import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const BACKEND_URL = 'http://127.0.0.1:8000';

function MyCars() {
  const navigate = useNavigate();
  const toast = useToast();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Delete-confirmation state ──────────────────────── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch cars ─────────────────────────────────────── */
  const fetchMyCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('/my-cars');
      setCars(data);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMyCars();
  }, [fetchMyCars]);

  /* ── Delete handler ─────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const carName = `${deleteTarget.brand} ${deleteTarget.name}`;
    setDeleting(true);
    try {
      await api(`/cars/${deleteTarget.id}`, { method: 'DELETE' });
      setCars((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(`${carName} deleted successfully`);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">My Cars</h1>
          {!loading && cars.length > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {cars.length} {cars.length === 1 ? 'car' : 'cars'} listed
            </p>
          )}
        </div>
        <Link
          to="/dealer/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Car
        </Link>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center gap-3 py-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">Loading your cars…</p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────── */}
      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 dark:border-rose-500/20 dark:bg-rose-500/5">
          <p className="text-sm text-rose-600 dark:text-rose-400">Error: {error}</p>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────── */}
      {!loading && !error && cars.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-20 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800/60">
            <svg className="h-8 w-8 text-gray-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H18.75m-2.25 0h-6m0 0V6.375c0-.621.504-1.125 1.125-1.125h4.072c.382 0 .741.194.949.513l2.897 4.467A1.125 1.125 0 0 1 19.5 10.5H10.5v8.25Z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700 dark:text-slate-300">No cars listed yet</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">Add your first car to get started.</p>
          </div>
          <Link
            to="/dealer/add"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Car
          </Link>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────── */}
      {!loading && !error && cars.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-slate-800 dark:shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/80">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Car</th>
                  <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell dark:text-slate-500">Brand</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Price</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {cars.map((car) => {
                  const imgSrc = car.image_url
                    ? `${BACKEND_URL}/${car.image_url.replace(/^\//, '')}`
                    : null;
                  return (
                    <tr key={car.id} className="bg-white transition-colors hover:bg-gray-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800">
                            {imgSrc ? (
                              <img src={imgSrc} alt={`${car.brand} ${car.name}`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-base text-gray-400 dark:text-slate-600">🚗</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-slate-100">{car.name}</p>
                            <p className="mt-0.5 text-xs text-gray-400 sm:hidden dark:text-slate-500">{car.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-5 py-4 text-gray-500 sm:table-cell dark:text-slate-400">{car.brand}</td>
                      <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">₹{new Intl.NumberFormat('en-IN').format(car.price)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dealer/edit/${car.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/5 dark:text-sky-400 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(car)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            Delete
                          </button>
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

      {/* ── Delete Confirmation Modal ─────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 animate-overlay-in bg-black/40 backdrop-blur-sm dark:bg-black/70" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative w-full max-w-md animate-modal-in rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
              <svg className="h-7 w-7 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-slate-50">Delete Car</h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-700 dark:text-slate-200">{deleteTarget.brand} {deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-100">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50">
                {deleting ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Deleting…</>
                ) : (
                  <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCars;
