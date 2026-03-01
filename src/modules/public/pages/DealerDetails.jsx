import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CarCard from '../../../shared/components/CarCard';
import api from '../../../shared/services/api';

function DealerDetails() {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api(`/dealers/${id}`)
      .then((data) => { setDealer(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  /* -- Loading ---------------------------------------- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  /* -- Error ------------------------------------------ */
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="mt-4 text-lg font-medium text-rose-500 dark:text-rose-400">{error}</p>
        <Link
          to="/dealers"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          ← Back to Dealers
        </Link>
      </div>
    );
  }

  /* -- Not found -------------------------------------- */
  if (!dealer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <span className="text-4xl">🔍</span>
        <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">Dealer not found.</p>
        <Link
          to="/dealers"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          ← Back to Dealers
        </Link>
      </div>
    );
  }

  const cityName = dealer.city?.name;
  const cars = dealer.cars || [];

  return (
    <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8 sm:py-12">
      {/* Back link */}
      <Link
        to="/dealers"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
      >
        ← Back to Dealers
      </Link>

      {/* -- Dealer Profile Card ---------------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-900/50 dark:shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: avatar + info */}
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-bold text-sky-600 dark:bg-sky-500/15 dark:text-sky-400 sm:h-20 sm:w-20 sm:text-3xl">
              {dealer.name?.charAt(0).toUpperCase()}
            </div>

            {/* Name + city */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {dealer.name}
              </h1>

              {cityName && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                  <svg className="h-4 w-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {cityName}
                </p>
              )}

              {/* Cars count badge */}
              <span className="mt-3 inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                {cars.length} {cars.length === 1 ? 'car' : 'cars'} listed
              </span>
            </div>
          </div>

          {/* Right: contact info */}
          <div className="flex flex-col gap-2 sm:items-end">
            {dealer.email && (
              <a
                href={`mailto:${dealer.email}`}
                className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
              >
                <svg className="h-4 w-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {dealer.email}
              </a>
            )}
            {dealer.phone && (
              <a
                href={`tel:${dealer.phone}`}
                className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
              >
                <svg className="h-4 w-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {dealer.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* -- Car Listings ----------------------------- */}
      <section className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Inventory
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-slate-800" />
        </div>

        {cars.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-950/40">
            <span className="text-5xl">🚗</span>
            <p className="text-base font-medium text-gray-700 dark:text-slate-300">
              No cars listed yet
            </p>
            <p className="text-sm text-gray-400 dark:text-slate-500">
              This dealer hasn't added any cars to their inventory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DealerDetails;

