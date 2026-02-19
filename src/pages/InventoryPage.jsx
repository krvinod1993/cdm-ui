import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';
const PAGE_LIMIT = 6;

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, current - 1, current, current + 1, total - 1, total]);
  const filtered = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i > 0 && filtered[i] - filtered[i - 1] > 1) result.push('...');
    result.push(filtered[i]);
  }
  return result;
}

function InventoryPage() {
  /* ── City state ────────────────────────────────────── */
  const [cities, setCities] = useState([]);
  const [citySlug, setCitySlug] = useState('');
  const [citiesLoading, setCitiesLoading] = useState(true);

  /* ── Filter state ──────────────────────────────────── */
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cars, setCars] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  /* ── Fetch cities on mount ─────────────────────────── */
  useEffect(() => {
    api('/cities')
      .then((data) => {
        setCities(data);
        if (data.length > 0) {
          setCitySlug(data[0].slug);
        }
      })
      .catch(() => {})
      .finally(() => setCitiesLoading(false));
  }, []);

  /* ── Fetch brand list (all active cities, once) ────── */
  useEffect(() => {
    api('/cars?limit=500')
      .then((data) => {
        const brands = [...new Set(data.items.map((c) => c.brand))].sort();
        setAllBrands(brands);
      })
      .catch(() => {});
  }, []);

  /* ── Fetch helper (builds query from current state) ── */
  const fetchCars = useCallback(
    (pageVal) => {
      const params = new URLSearchParams();
      if (citySlug) params.set('city_slug', citySlug);
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (brand) params.set('brand', brand);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      if (sort) params.set('sort', sort);
      params.set('page', String(pageVal));
      params.set('limit', String(PAGE_LIMIT));

      setLoading(true);
      setError(null);
      api(`/cars?${params.toString()}`)
        .then((data) => { setCars(data.items); setTotal(data.total); })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [citySlug, debouncedSearch, brand, minPrice, maxPrice, sort],
  );

  /* ── Refetch on any filter / city change ───────────── */
  useEffect(() => {
    if (!citySlug) return;
    setPage(1);
    fetchCars(1);
  }, [fetchCars]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Pagination ────────────────────────────────────── */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    fetchCars(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Clear filters (keeps city) ────────────────────── */
  const clearFilters = () => { setSearch(''); setBrand(''); setMinPrice(''); setMaxPrice(''); setSort(''); };
  const hasActiveFilters = search || brand || minPrice || maxPrice || sort;

  /* ── Selected city name for header ─────────────────── */
  const selectedCity = cities.find((c) => c.slug === citySlug);

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {selectedCity
              ? `Showing cars in ${selectedCity.name}`
              : 'Browse our complete collection of cars'}
          </p>
        </div>
        {!loading && total > 0 && (
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            {total} {total === 1 ? 'car' : 'cars'} available
          </span>
        )}
      </div>

      {/* ── City Selector ────────────────────────────── */}
      {citiesLoading && (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <span className="text-sm text-gray-400 dark:text-slate-500">Loading cities…</span>
        </div>
      )}

      {!citiesLoading && cities.length === 1 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/25">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
          {cities[0].name}
        </span>
      )}

      {!citiesLoading && cities.length > 1 && (
        <div className="flex items-center gap-3">
          <label htmlFor="city-select" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-slate-300">
            <svg className="h-4 w-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            City
          </label>
          <select
            id="city-select"
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value)}
            className="w-full max-w-xs appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:w-auto"
          >
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Filter Panel ─────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="inv-search" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Search</label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input id="inv-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name…" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="inv-brand" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Brand</label>
            <select id="inv-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <option value="">All Brands</option>
              {allBrands.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="inv-min" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Min Price</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500">₹</span>
              <input id="inv-min" type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-7 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="inv-max" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Max Price</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500">₹</span>
              <input id="inv-max" type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-7 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
            </div>
          </div>

          {/* Sort */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="inv-sort" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Sort By</label>
            <select id="inv-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <option value="">Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">Loading cars…</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────── */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────── */}
      {!loading && !error && cars.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="text-5xl">🚗</span>
          {hasActiveFilters ? (
            <>
              <p className="text-base font-medium text-gray-700 dark:text-slate-300">No cars match your filters</p>
              <p className="text-sm text-gray-400 dark:text-slate-500">Try adjusting or clearing your filters.</p>
              <button onClick={clearFilters} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-gray-700 dark:text-slate-300">No cars available</p>
              <p className="text-sm text-gray-400 dark:text-slate-500">
                {selectedCity
                  ? `No cars listed in ${selectedCity.name} right now. Check back soon.`
                  : 'Our inventory is empty right now. Check back soon for new arrivals.'}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Car grid ─────────────────────────────────── */}
      {!loading && !error && cars.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <Link key={car.id} to={`/cars/${car.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-900/50 dark:shadow-lg dark:shadow-slate-950/40 dark:hover:border-sky-500/50 dark:hover:shadow-sky-900/20">
              <div className="h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                {car.image_url ? (
                  <img src={`${BACKEND_URL}/${car.image_url.replace(/^\//, '')}`} alt={`${car.brand} ${car.name}`} className="h-full w-full rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-t-2xl bg-gray-100 dark:bg-slate-800/60"><span className="text-3xl text-gray-400 dark:text-slate-600">🚗</span></div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800/80 dark:text-slate-300">{car.brand}</span>
                <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl dark:text-slate-50">{car.name}</h3>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-800/60">
                  <p className="text-xl font-extrabold text-blue-600 sm:text-2xl dark:text-blue-400">{formatINR(car.price)}</p>
                  <span className="text-xs text-gray-400 transition group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400">View details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────── */}
      {!loading && !error && total > PAGE_LIMIT && (
        <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400 dark:text-slate-500">
            Showing{' '}
            <span className="font-medium text-gray-700 dark:text-slate-300">{(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)}</span>{' '}
            of <span className="font-medium text-gray-700 dark:text-slate-300">{total}</span> cars
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Previous page">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            {getPageNumbers(page, totalPages).map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 dark:text-slate-600">…</span>
              ) : (
                <button key={p} onClick={() => handlePageChange(p)} className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition ${p === page ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'border border-gray-300 text-gray-500 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200'}`}>
                  {p}
                </button>
              ),
            )}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Next page">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
