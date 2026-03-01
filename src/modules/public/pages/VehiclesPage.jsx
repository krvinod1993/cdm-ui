import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://127.0.0.1:8000';
const PAGE_LIMIT = 12;

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/* â”€â”€ Debounce hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function VehiclesPage() {
  /* â”€â”€ Vehicle / pagination state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* â”€â”€ Filter state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  /* â”€â”€ Category dropdown options â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const hasActiveFilters = search || brand || category || minPrice || maxPrice;

  /* â”€â”€ Fetch categories on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/vehicle-categories`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        console.log('[VehiclesPage] Categories:', data);
        setCategories(Array.isArray(data) ? data : data.data ?? data.results ?? []);
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  /* â”€â”€ Fetch vehicles (public, no auth) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const fetchVehicles = useCallback(
    async (pageVal) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', String(pageVal));
        params.set('limit', String(PAGE_LIMIT));
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (brand) params.set('brand', brand);
        if (category) params.set('category_id', category);
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);

        const res = await fetch(`${BACKEND_URL}/api/public/vehicles?${params.toString()}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || `Request failed (${res.status})`);
        }
        const data = await res.json();
        console.log('[VehiclesPage] API response:', data);
        const list = Array.isArray(data.data) ? data.data : [];
        setVehicles(list);
        setTotal(data.total ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, brand, category, minPrice, maxPrice],
  );

  /* â”€â”€ Refetch when filters change â†’ reset to page 1 â”€â”€ */
  useEffect(() => {
    setPage(1);
    fetchVehicles(1);
  }, [fetchVehicles]); // eslint-disable-line react-hooks/exhaustive-deps

  /* â”€â”€ Pagination handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    fetchVehicles(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* â”€â”€ Clear all filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const clearFilters = () => {
    setSearch('');
    setBrand('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-8">
      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">
            Vehicles
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Browse our complete collection of vehicles
          </p>
        </div>
        {!loading && total > 0 && (
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            {total} {total === 1 ? 'vehicle' : 'vehicles'} available
          </span>
        )}
      </div>

      {/* â”€â”€ Filter Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="veh-search" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Search</label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                id="veh-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by nameâ€¦"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="veh-category" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Category</label>
            <select
              id="veh-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={categoriesLoading}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id ?? cat.slug ?? cat.name} value={cat.id ?? cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="veh-brand" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Brand</label>
            <input
              id="veh-brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Toyota"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="veh-min" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Min Price</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500">â‚¹</span>
              <input
                id="veh-min"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-7 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="veh-max" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-slate-400">Max Price</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500">â‚¹</span>
              <input
                id="veh-max"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-7 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">Loading vehiclesâ€¦</p>
        </div>
      )}

      {/* â”€â”€ Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <span className="text-4xl">âš ï¸</span>
          <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
          <button
            onClick={() => { setPage(1); fetchVehicles(1); }}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
          >
            Retry
          </button>
        </div>
      )}

      {/* â”€â”€ Empty state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="text-5xl">ðŸš—</span>
          {hasActiveFilters ? (
            <>
              <p className="text-base font-medium text-gray-700 dark:text-slate-300">
                No vehicles match your filters
              </p>
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Try adjusting or clearing your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-gray-700 dark:text-slate-300">
                No vehicles available
              </p>
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Check back soon for new listings.
              </p>
            </>
          )}
        </div>
      )}

      {/* â”€â”€ Vehicle grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((v) => {
            const imgSrc = v.image_url
              ? `${BACKEND_URL}/${v.image_url.replace(/^\//, '')}`
              : null;

            return (
              <Link
                key={v.id}
                to={`/vehicles/${v.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-900/50 dark:shadow-lg dark:shadow-slate-950/40 dark:hover:border-sky-500/50 dark:hover:shadow-sky-900/20"
              >
                {/* Image */}
                <div className="h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${v.brand} ${v.title ?? v.name}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-slate-800/60">
                      <span className="text-3xl text-gray-400 dark:text-slate-600">ðŸš—</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                  {/* Brand badge */}
                  <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800/80 dark:text-slate-300">
                    {v.brand}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-slate-50">
                    {v.title ?? v.name}
                  </h3>

                  {/* Category + Dealer */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
                    {(v.category_name ?? v.category) && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        {v.category_name ?? v.category}
                      </span>
                    )}
                    {(v.dealer_name ?? v.dealer) && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                        {v.dealer_name ?? v.dealer}
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-800/60">
                    <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      {formatINR(v.price)}
                    </p>
                    <span className="text-xs text-gray-400 transition group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400">
                      View details â†’
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && !error && total > PAGE_LIMIT && (
        <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400 dark:text-slate-500">
            Showing{' '}
            <span className="font-medium text-gray-700 dark:text-slate-300">
              {(page - 1) * PAGE_LIMIT + 1}â€“{Math.min(page * PAGE_LIMIT, total)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-700 dark:text-slate-300">{total}</span>{' '}
            vehicles
          </p>

          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Previous
            </button>

            {/* Page indicator */}
            <span className="px-3 text-sm font-medium text-gray-600 dark:text-slate-300">
              {page} / {totalPages}
            </span>

            {/* Next */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              Next
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehiclesPage;
