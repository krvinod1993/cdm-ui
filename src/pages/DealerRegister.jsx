import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://127.0.0.1:8000';

function DealerRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityId, setCityId] = useState('');

  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/cities`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function parseErrors(data) {
    const detail = data?.detail;
    if (typeof detail === 'string') return [detail];
    if (Array.isArray(detail)) return detail.map((d) => d.msg || String(d));
    if (data?.message) return [data.message];
    return ['Registration failed. Please try again.'];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, city_id: Number(cityId) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(parseErrors(data));
        return;
      }
      navigate('/dealer/login');
    } catch {
      setErrors(['Network error. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500';

  return (
    <div className="flex items-center justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-lg"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Dealer Registration</h1>

        {errors && (
          <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {errors.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Dealer Name</label>
          <input id="reg-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your dealership name" />
        </div>

        <div className="space-y-2">
          <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
          <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="dealer@example.com" />
        </div>

        <div className="space-y-2">
          <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
          <input id="reg-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Create a password" />
        </div>

        <div className="space-y-2">
          <label htmlFor="reg-city" className="block text-sm font-medium text-gray-700 dark:text-slate-300">City</label>
          <select id="reg-city" required value={cityId} onChange={(e) => setCityId(e.target.value)} className={inputCls}>
            <option value="" disabled>Select a city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/dealer/login" className="font-medium text-blue-500 hover:text-blue-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default DealerRegister;
