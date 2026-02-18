import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BACKEND_URL = 'http://127.0.0.1:8000';

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/cars/${id}`)
      .then((data) => { setCar(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading car details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm text-rose-500 dark:text-rose-400">Error: {error}</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-gray-500 dark:text-slate-400">Car not found.</p>
      </div>
    );
  }

  const imageSrc = car.image_url
    ? `${BACKEND_URL}/${car.image_url.replace(/^\//, '')}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block dark:text-blue-400">
        ← Back to Home
      </Link>

      <div className="mb-10 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-white">
        {imageSrc ? (
          <img src={imageSrc} alt={`${car.brand} ${car.name}`} className="block h-[300px] w-full rounded-2xl object-cover" />
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800/60">
            <span className="text-3xl text-gray-400 dark:text-slate-600">🚗</span>
          </div>
        )}
      </div>

      <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">{car.name}</h1>
      <p className="text-lg mb-6 text-gray-500 dark:text-slate-400">{car.brand}</p>

      {car.price && (
        <p className="text-3xl font-bold text-blue-600 mb-6 dark:text-blue-400">
          ₹{new Intl.NumberFormat('en-IN').format(car.price)}
        </p>
      )}

      {car.dealer && (
        <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Dealer</h2>
          <Link to={`/dealers/${car.dealer.id}`} className="text-blue-600 hover:underline text-base font-medium dark:text-blue-400">
            {car.dealer.name}
          </Link>
        </div>
      )}
    </div>
  );
}

export default CarDetails;
