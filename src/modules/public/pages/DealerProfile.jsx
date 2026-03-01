import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CarCard from '../../../shared/components/CarCard';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function normalizeDealer(payload) {
  if (!payload) return null;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  if (payload.dealer && !Array.isArray(payload.dealer)) return payload.dealer;
  return payload;
}

function normalizeVehicles(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function DealerProfile() {
  const { dealerId } = useParams();
  const [dealer, setDealer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dealerId) {
      setError('Invalid dealer id.');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const dealerUrl = `${BACKEND_URL}/api/public/dealers/${dealerId}`;
    const vehiclesUrl = `${BACKEND_URL}/api/public/vehicles?dealer_id=${encodeURIComponent(dealerId)}`;

    Promise.all([
      fetch(dealerUrl).then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || `Failed to fetch dealer (${res.status})`);
        }
        return res.json();
      }),
      fetch(vehiclesUrl).then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || `Failed to fetch inventory (${res.status})`);
        }
        return res.json();
      }),
    ])
      .then(([dealerPayload, vehiclesPayload]) => {
        if (!active) return;
        setDealer(normalizeDealer(dealerPayload));
        setVehicles(normalizeVehicles(vehiclesPayload));
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Something went wrong.');
        setDealer(null);
        setVehicles([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dealerId]);

  const trustItems = useMemo(
    () => [
      { label: 'Listed Vehicles', value: vehicles.length },
      { label: 'City', value: dealer?.city?.name || dealer?.city_name || 'N/A' },
      { label: 'Dealer ID', value: dealer?.id || dealerId || 'N/A' },
    ],
    [dealer, vehicles.length, dealerId],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading dealer profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        <Link to="/dealers" className="mt-3 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400">
          Back to dealers
        </Link>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-gray-500 dark:text-slate-400">Dealer not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Dealer Profile</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-slate-100">{dealer.name || 'Dealer'}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          Public profile and inventory overview.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {trustItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-slate-100">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">About</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          {dealer.description || dealer.about || 'No dealer description available yet.'}
        </p>
        {dealer.email && (
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            Contact: <a href={`mailto:${dealer.email}`} className="text-sky-600 dark:text-sky-400">{dealer.email}</a>
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Inventory</h2>
        {vehicles.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-slate-700 dark:text-slate-400">
            No vehicles listed for this dealer.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DealerProfile;

