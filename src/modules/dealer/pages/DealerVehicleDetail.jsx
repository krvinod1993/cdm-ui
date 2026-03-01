import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../shared/services/api';

const BACKEND_URL = import.meta.env.VITE_API_URL;

function DealerVehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusMessageType, setStatusMessageType] = useState('success');

  useEffect(() => {
    async function fetchVehicle() {
      setLoading(true);
      setError(null);
      try {
        const data = await api(`/vehicles/${vehicleId}`);
        setVehicle(data);
        setStatus(data.status || 'draft');
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/dealer/login', { replace: true });
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [vehicleId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-medium text-rose-500 dark:text-rose-400">{error}</p>
        <Link
          to="/dealer/vehicles"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          &larr; Back to My Vehicles
        </Link>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg text-gray-500 dark:text-slate-400">Vehicle not found.</p>
        <Link
          to="/dealer/vehicles"
          className="mt-4 inline-block text-sm text-sky-600 hover:underline dark:text-sky-400"
        >
          &larr; Back to My Vehicles
        </Link>
      </div>
    );
  }

  const imageSrc = vehicle.image_url
    ? `${BACKEND_URL}/${vehicle.image_url.replace(/^\//, '')}`
    : null;

  const handleStatusUpdate = async () => {
    setStatusUpdating(true);
    setStatusMessage('');
    setStatusMessageType('success');
    try {
      await api(`/dealer/vehicles/${vehicleId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setVehicle((prev) => (prev ? { ...prev, status } : prev));
      setStatusMessage('Status updated successfully.');
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      setStatusMessageType('error');
      setStatusMessage(err.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          to="/dealer/vehicles"
          className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          &larr; Back to My Vehicles
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-slate-50">
          {vehicle.brand} {vehicle.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Dealer vehicle detail view
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${vehicle.brand} ${vehicle.name}`}
              className="h-64 w-full object-cover sm:h-80 lg:h-[400px]"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center sm:h-80 lg:h-[400px]">
              <span className="text-5xl text-gray-300 dark:text-slate-600">&#128663;</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg">
          <div className="mb-5">
            <label
              htmlFor="vehicle-status"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400"
            >
              Vehicle Status
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="vehicle-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="sold">sold</option>
                <option value="draft">draft</option>
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={statusUpdating}
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {statusUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
            {statusMessage && (
              <p
                className={`mt-2 text-xs ${statusMessageType === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
              >
                {statusMessage}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
              &#8377;{new Intl.NumberFormat('en-IN').format(vehicle.price)}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              <span className="font-semibold">Status:</span> {vehicle.status || 'unknown'}
            </p>
            {vehicle.category_name && (
              <p className="text-sm text-gray-600 dark:text-slate-300">
                <span className="font-semibold">Category:</span> {vehicle.category_name}
              </p>
            )}
            {vehicle.description && (
              <p className="whitespace-pre-line text-sm text-gray-600 dark:text-slate-300">
                {vehicle.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/dealer/vehicles/${vehicle.id}/edit`}
              className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              Edit Vehicle
            </Link>
            <Link
              to="/dealer/vehicles"
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerVehicleDetail;
