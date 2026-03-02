import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function VehicleCard({ vehicle, wishlistIds = [], setWishlistIds }) {
  const navigate = useNavigate();
  const isWishlisted = wishlistIds.includes(vehicle.id);

  const imageSrc = vehicle.image_url
    ? `${BACKEND_URL}/${vehicle.image_url.replace(/^\//, '')}`
    : null;

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem('customer_access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (typeof setWishlistIds !== 'function') {
      return;
    }

    if (isWishlisted) {
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setWishlistIds((prev) => prev.filter((id) => id !== vehicle.id));
      }
    } else {
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist/${vehicle.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setWishlistIds((prev) => [...prev, vehicle.id]);
      }
    }
  };

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-900/50 dark:shadow-lg dark:shadow-slate-950/40 dark:hover:border-sky-500/50 dark:hover:shadow-sky-900/20"
    >
      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${vehicle.brand} ${vehicle.name}`}
            className="h-full w-full rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-t-2xl bg-gray-100 dark:bg-slate-800/60">
            <span className="text-3xl text-gray-400 dark:text-slate-600">🚗</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
            isWishlisted
              ? 'border-rose-500/40 bg-rose-500/20 text-rose-500'
              : 'border-white/40 bg-black/25 text-white hover:bg-black/40'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:bg-slate-800/80 dark:text-slate-300">
          {vehicle.brand}
        </span>
        <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl dark:text-slate-50">
          {vehicle.name}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-800/60">
          <p className="text-xl font-extrabold text-blue-600 sm:text-2xl dark:text-blue-400">
            ₹{new Intl.NumberFormat('en-IN').format(vehicle.price)}
          </p>
          <span className="text-xs text-gray-400 transition group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;
