import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -- Lead / contact form state --------------------------- */
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: Number(id),
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          message: leadMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Request failed (${res.status})`);
      }
      setSubmitted(true);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
      setLeadMessage('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BACKEND_URL}/api/public/vehicles/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('not_found');
          return res.json().catch(() => ({})).then((d) => {
            throw new Error(d.detail || `Request failed (${res.status})`);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.is_active === false) {
          throw new Error('not_found');
        }
        setVehicle(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  /* -- Loading ------------------------------------------- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  /* -- Not found / inactive ------------------------------ */
  if (error === 'not_found' || (!error && !vehicle)) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/60">
          <svg className="h-10 w-10 text-gray-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vehicle not available</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          This vehicle may have been removed or is no longer active.
        </p>
        <Link
          to="/vehicles"
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Vehicles
        </Link>
      </div>
    );
  }

  /* -- Error ---------------------------------------------- */
  if (error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
        <Link
          to="/vehicles"
          className="mt-2 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          &larr; Back to Vehicles
        </Link>
      </div>
    );
  }

  /* -- Helpers -------------------------------------------- */
  const v = vehicle;
  const imgSrc = v.image_url
    ? `${BACKEND_URL}/${v.image_url.replace(/^\//, '')}`
    : null;

  const specs =
    v.specifications && typeof v.specifications === 'object'
      ? Object.entries(v.specifications)
      : [];

  return (
    <div className="mx-auto max-w-5xl animate-fade-in px-4 py-8 sm:py-12">
      {/* -- Back link ------------------------------------- */}
      <Link
        to="/vehicles"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back to Vehicles
      </Link>

      {/* -- Main grid: image + info ----------------------- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`${v.brand} ${v.title ?? v.name}`}
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
          {/* Top section */}
          <div>
            {/* Brand badge */}
            <span className="mb-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800 dark:text-slate-300">
              {v.brand}
            </span>

            {/* Title */}
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl dark:text-white">
              {v.title ?? v.name}
            </h1>

            {/* Meta row: year + category */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {v.year && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  {v.year}
                </span>
              )}

              {(v.category_name ?? v.category) && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                  {v.category_name ?? v.category}
                </span>
              )}
            </div>

            {/* Price */}
            <p className="mt-5 text-3xl font-bold text-sky-600 dark:text-sky-400">
              {formatINR(v.price)}
            </p>
          </div>

          {/* Dealer card */}
          {(v.dealer_name ?? v.dealer) && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:shadow-lg">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Sold by
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {v.dealer_name ?? v.dealer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -- Description ----------------------------------- */}
      {v.description && (
        <section className="mt-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Description
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              {v.description}
            </p>
          </div>
        </section>
      )}

      {/* -- Specifications -------------------------------- */}
      {specs.length > 0 && (
        <section className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
              </svg>
              Specifications
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-700 dark:bg-slate-700">
              {specs.map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col gap-1 bg-white px-5 py-4 dark:bg-slate-800/80"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                    {key.replace(/[_-]/g, ' ')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -- Contact Dealer -------------------------------- */}
      <section className="mt-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            Contact Dealer
          </h2>
          <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
            Interested in this vehicle? Send a message and the dealer will get back to you.
          </p>

          {/* -- Success state ---------------------------- */}
          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-8 text-center dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <span className="text-4xl">✅</span>
              <p className="mt-3 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                Message sent!
              </p>
              <p className="mt-1 text-sm text-emerald-600/70 dark:text-emerald-400/60">
                The dealer will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setSubmitError(null); setShowForm(true); }}
                className="mt-4 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Send another message
              </button>
            </div>
          ) : !showForm ? (
            /* -- CTA button ---------------------------- */
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-[0.98] dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-offset-slate-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Contact Dealer
            </button>
          ) : (
            /* -- Inline form --------------------------- */
            <form onSubmit={handleLeadSubmit} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-1">
                <label htmlFor="lead-name" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-1">
                <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label htmlFor="lead-email" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor="lead-message" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Message <span className="text-gray-300 dark:text-slate-600">(optional)</span>
                </label>
                <textarea
                  id="lead-message"
                  rows={4}
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this vehicle…"
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Error */}
              {submitError && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-rose-500 dark:text-rose-400">{submitError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-offset-slate-900"
                >
                  {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  {submitting ? 'Sending\u2026' : 'Send Message'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(null); }}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default VehicleDetailPage;
