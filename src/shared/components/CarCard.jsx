import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://127.0.0.1:8000';

function CarCard({ car }) {
  const { id, name, brand, price, image_url } = car;

  const imageSrc = image_url
    ? `${BACKEND_URL}/${image_url.replace(/^\//, '')}`
    : null;

  return (
    <Link
      to={`/vehicles/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-900/50 dark:shadow-lg dark:shadow-slate-950/40 dark:hover:border-sky-500/50 dark:hover:shadow-sky-900/20"
    >
      {/* Image */}
      <div className="h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${brand} ${name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-slate-800/60">
            <span className="text-3xl text-gray-400 dark:text-slate-600">ðŸš—</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Brand badge */}
        <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800/80 dark:text-slate-300">
          {brand}
        </span>

        {/* Car name */}
        <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-slate-50">
          {name}
        </h3>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-800/60">
          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            â‚¹{new Intl.NumberFormat('en-IN').format(price)}
          </p>
          <span className="text-xs text-gray-400 transition group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400">
            View details â†’
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;
