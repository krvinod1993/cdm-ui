import { useEffect, useState } from 'react';
import VehicleCard from '../../public/components/VehicleCard';

const BASE_URL = 'http://localhost:8000';

function Wishlist() {
  const [vehicles, setVehicles] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customer_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const loadWishlistVehicles = async () => {
      try {
        const wishlistRes = await fetch(`${BASE_URL}/api/customer/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!wishlistRes.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const wishlistData = await wishlistRes.json();
        const list = Array.isArray(wishlistData)
          ? wishlistData
          : Array.isArray(wishlistData.items)
            ? wishlistData.items
            : Array.isArray(wishlistData.data)
              ? wishlistData.data
              : [];

        const ids = list
          .map((item) => item.vehicle_id ?? item.id)
          .filter((id) => typeof id === 'number');

        setWishlistIds(ids);

        if (ids.length === 0) {
          setVehicles([]);
          return;
        }

        const vehicleResults = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`${BASE_URL}/api/public/vehicles/${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data?.data ?? data?.item ?? data ?? null;
          }),
        );

        setVehicles(vehicleResults.filter(Boolean));
      } catch {
        setVehicles([]);
        setWishlistIds([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistVehicles();
  }, []);

  const updateWishlistIds = (updater) => {
    setWishlistIds((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setVehicles((current) => current.filter((vehicle) => next.includes(vehicle.id)));
      return next;
    });
  };

  return (
    <section className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Vehicles you saved for later.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">Loading wishlist...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">No vehicles in wishlist</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              wishlistIds={wishlistIds}
              setWishlistIds={updateWishlistIds}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
