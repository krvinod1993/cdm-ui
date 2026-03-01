import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../../shared/components/HeroSection';
import CarCard from '../../../shared/components/CarCard';

const BACKEND_URL = 'http://127.0.0.1:8000';

function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/public/vehicles?city_slug=noida&limit=6`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setCars(Array.isArray(data.data) ? data.data : data.items ?? []);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const featured = cars.slice(0, 6);

  return (
    <div>
      {/* â”€â”€ Section 1 â€” Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <HeroSection />

      {/* â”€â”€ Section 2 â€” Featured Cars â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mt-20 space-y-8 sm:mt-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400/80">
              Curated Selection
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Featured Cars
            </h2>
            <p className="mt-1 text-sm text-gray-400 dark:text-white/40">
              Hand-picked listings from our top dealers in Noida
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500 transition hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
          >
            View all inventory
            <span className="transition-transform group-hover:translate-x-0.5">â†’</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500 dark:border-white/10 dark:border-t-amber-400" />
            <p className="text-sm text-gray-400 dark:text-white/40">Loading featured cars...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="text-4xl">âš ï¸</span>
            <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-20 dark:border-white/10 dark:bg-white/[0.02]">
            <span className="text-5xl">ðŸš—</span>
            <p className="text-base font-medium text-gray-600 dark:text-white/60">No cars listed yet</p>
            <p className="text-sm text-gray-400 dark:text-white/30">Check back soon â€” dealers are adding new inventory daily.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* â”€â”€ Section 3 â€” Why Choose Us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mt-24 space-y-10 sm:mt-28">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400/80">
            Our Promise
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400 sm:text-base dark:text-white/40">
            A premium experience built on trust, transparency, and simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              emoji: 'ðŸ›¡ï¸',
              title: 'Verified Dealers',
              desc: 'Every dealer on our platform is verified and vetted so you can buy with complete confidence.',
            },
            {
              emoji: 'ðŸ’°',
              title: 'Transparent Pricing',
              desc: 'No hidden charges, no surprises â€” see the real price upfront for every car listed.',
            },
            {
              emoji: 'ðŸ“ž',
              title: 'Direct Contact',
              desc: 'Connect with dealers directly. No middlemen, no delays â€” just a straightforward buying experience.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02] dark:backdrop-blur-sm dark:hover:border-amber-500/20 dark:hover:bg-white/[0.04]"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl transition-colors group-hover:bg-amber-100 dark:bg-amber-500/10 dark:group-hover:bg-amber-500/15">
                {card.emoji}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400 dark:text-white/40">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Section 4 â€” Dealer CTA Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="mt-24 mb-4 sm:mt-28">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-8 py-16 text-center sm:px-12 sm:py-20 dark:border-white/[0.06] dark:from-amber-500/10 dark:via-transparent dark:to-amber-500/10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-amber-200/30 blur-[80px] dark:bg-amber-500/10" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-200/30 blur-[80px] dark:bg-amber-500/10" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Are you a dealer?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base dark:text-white/40">
              List your cars on our platform and reach thousands of verified buyers in Noida.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30"
            >
              Register as Dealer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

