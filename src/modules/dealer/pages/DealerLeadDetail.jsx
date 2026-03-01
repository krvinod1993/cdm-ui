import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../shared/services/api';

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

const statusStyles = {
  new: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20',
  contacted:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  closed:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
};

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DealerLeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('new');
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusMessageType, setStatusMessageType] = useState('success');

  useEffect(() => {
    async function fetchLead() {
      setLoading(true);
      setError(null);
      try {
        const data = await api('/my-leads');
        const leads = Array.isArray(data) ? data : [];
        const matchedLead = leads.find((item) => String(item.id) === String(leadId));

        if (!matchedLead) {
          setLead(null);
          setError('Lead not found.');
          return;
        }

        setLead(matchedLead);
        setStatus((matchedLead.status || 'NEW').toLowerCase());
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

    fetchLead();
  }, [leadId, navigate]);

  const normalizedStatus = useMemo(
    () => (lead?.status || 'NEW').toLowerCase(),
    [lead],
  );

  const vehicleId = lead?.vehicle_id ?? lead?.car_id;
  const vehicleName =
    lead?.vehicle_title ||
    lead?.car_title ||
    (vehicleId ? `Vehicle #${vehicleId}` : 'Vehicle not available');
  const vehiclePrice = lead?.vehicle_price ?? lead?.car_price ?? null;

  const handleUpdateStatus = async () => {
    setUpdating(true);
    setStatusMessage('');
    setStatusMessageType('success');
    try {
      await api(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: status.toUpperCase() }),
      });
      setLead((prev) => (prev ? { ...prev, status: status.toUpperCase() } : prev));
      setStatusMessage('Lead status updated.');
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/dealer/login', { replace: true });
        return;
      }
      setStatusMessageType('error');
      setStatusMessage(err.message || 'Unable to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10 text-center">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
        <Link
          to="/dealer/leads"
          className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          &larr; Back to Leads
        </Link>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10 text-center">
        <p className="text-sm text-gray-500 dark:text-slate-400">Lead not found.</p>
        <Link
          to="/dealer/leads"
          className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          &larr; Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-8 shadow-sm sm:p-10 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/80 dark:shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/[0.04] blur-3xl dark:bg-sky-500/[0.07]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-500/[0.03] blur-3xl dark:bg-violet-500/[0.05]" />
        <div className="relative">
          <Link
            to="/dealer/leads"
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            &larr; Back to Leads
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            Lead Detail
          </h1>
          <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
            CRM view for lead #{leadId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Customer
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {lead.name || 'Unknown Customer'}
                </h2>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${statusStyles[normalizedStatus] || statusStyles.new}`}
              >
                {normalizedStatus}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/40">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {formatDate(lead.created_at)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/40">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Contact
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {lead.phone || '-'}
                </p>
                {lead.email && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{lead.email}</p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Message
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {lead.message || 'No message provided.'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Vehicle Info
            </p>
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {vehicleName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {vehiclePrice !== null
                  ? `Price: INR ${new Intl.NumberFormat('en-IN').format(vehiclePrice)}`
                  : 'Price not available'}
              </p>
              {vehicleId ? (
                <Link
                  to={`/dealer/vehicles/${vehicleId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/5 dark:text-sky-400 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10"
                >
                  View Vehicle
                </Link>
              ) : (
                <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-400">
                  Vehicle unavailable
                </span>
              )}
            </div>
          </div>
        </section>

        <aside>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Actions
            </h3>
            <div className="mt-4 space-y-3">
              <label htmlFor="lead-status" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </label>
              <select
                id="lead-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600"
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
              {statusMessage && (
                <p
                  className={`text-xs ${statusMessageType === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DealerLeadDetail;
