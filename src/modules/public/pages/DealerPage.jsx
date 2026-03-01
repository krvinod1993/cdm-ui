import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../shared/services/api';

function DealerPage() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api('/dealers')
      .then((data) => { setDealers(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading dealers...</p>
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">Our Dealers</h1>

      {dealers.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">No dealers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealers.map((dealer) => (
            <Link
              to={`/dealers/${dealer.id}`}
              key={dealer.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:scale-105 transition duration-300 cursor-pointer block dark:bg-slate-800 dark:border-slate-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{dealer.name}</h3>
              {dealer.location && (
                <p className="text-gray-500 mt-2 dark:text-slate-400">{dealer.location}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DealerPage;

