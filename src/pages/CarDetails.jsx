import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -- Contact form state -- */
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car_id: car?.id, name, phone, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Request failed (${res.status})`);
      }
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    api(`/vehicles/${id}`)
      .then((data) => { setCar(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  /* -- Loading state -- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  /* -- Error state -- */
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
          &larr; Back to Marketplace
        </Link>
      </div>
    );
  }

  /* -- Not found -- */
  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-gray-500 dark:text-slate-400">Car not found.</p>
        <Link
          to="/marketplace"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          &larr; Back to Marketplace
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
        &larr; Back to Marketplace
      </Link>

      {/* -- Main grid: image + info -- */}
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
              <span className="text-5xl text-gray-300 dark:text-slate-600">&#128663;</span>
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
              &#8377;{new Intl.NumberFormat('en-IN').format(car.price)}
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
                  &#128205; {cityName}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* -- Contact Dealer Form -- */}
      <section className="mt-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            Contact Dealer
          </h2>
          <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
            Interested in this car? Send a message and the dealer will get back to you.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-8 text-center dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <span className="text-4xl">&#9989;</span>
              <p className="mt-3 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                Message sent!
              </p>
              <p className="mt-1 text-sm text-emerald-600/70 dark:text-emerald-400/60">
                The dealer will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setSubmitError(null); }}
                className="mt-4 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-1">
                <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">
                  Message <span className="text-gray-300 dark:text-slate-600">(optional)</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this car..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-rose-500 dark:text-rose-400">{submitError}</p>
                </div>
              )}

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-offset-slate-900 sm:w-auto"
                >
                  {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  {submitting ? 'Sending\u2026' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default CarDetails;
