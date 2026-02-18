import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import api from '../services/api';

function DealerDetails() {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/dealers/${id}`)
      .then((data) => { setDealer(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading dealer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-gray-500 dark:text-slate-400">Dealer not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link to="/dealers" className="text-blue-600 hover:underline mb-6 inline-block dark:text-blue-400">
        ← Back to Dealers
      </Link>

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{dealer.name}</h1>

      <div className="space-y-1 text-gray-600 dark:text-slate-300">
        {dealer.location && <p><strong>Location:</strong> {dealer.location}</p>}
        {dealer.phone && <p><strong>Phone:</strong> {dealer.phone}</p>}
        {dealer.email && <p><strong>Email:</strong> {dealer.email}</p>}
      </div>

      {dealer.cars && dealer.cars.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-900 dark:text-white">Cars at this Dealer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dealer.cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DealerDetails;
