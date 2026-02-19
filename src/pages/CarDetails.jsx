import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/cars/${id}`)
      .then((data) => { setCar(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  /* ── Loading state ─────────────────────────────── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  /* ── Error state ───────────────────────────────── */
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
        <Link
          to="/marketplace"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  /* ── Not found ─────────────────────────────────── */
  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-gray-500 dark:text-slate-400">Car not found.</p>
        <Link
          to="/marketplace"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const imageSrc = car.image_url
    ? `${BACKEND_URL}/${car.image_url.replace(/^\//, '')}`
    : null;

  const dealer = car.dealer;
  const cityName = dealer?.city?.name;

  return (
    <div className="mx-auto max-w-5xl animate-fade-in px-4 py-8 sm:py-12">
      {/* Back link */}
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
      >
        ← Back to Marketplace
      </Link>

      {/* ── Main grid: image + info ──────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${car.brand} ${car.name}`}
              className="h-64 w-full object-cover sm:h-80 lg:h-[400px]"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center sm:h-80 lg:h-[400px]">
              <span className="text-5xl text-gray-300 dark:text-slate-600">🚗</span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col justify-between gap-6">
          {/* Top: name, brand, price */}
          <div>
            <span className="mb-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800 dark:text-slate-300">
              {car.brand}
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl dark:text-white">
              {car.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-sky-600 dark:text-sky-400">
              ₹{new Intl.NumberFormat('en-IN').format(car.price)}
            </p>
          </div>

          {/* Dealer card */}
          {dealer && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:shadow-lg">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Sold by
              </p>

              <Link
                to={`/dealers/${dealer.id}`}
                className="text-lg font-bold text-gray-900 transition hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
              >
                {dealer.name}
              </Link>

              {cityName && (
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  📍 {cityName}
                </p>
              )}
            </div>
          )}

          {/* Contact Dealer button */}
          <button className="w-full rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-[0.98] dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-offset-slate-900 sm:w-auto sm:self-start">
            Contact Dealer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
