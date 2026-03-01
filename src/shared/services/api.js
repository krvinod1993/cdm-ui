const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Centralized API client.
 *
 * - Prefixes every request with BASE_URL
 * - Automatically attaches Authorization header when a token exists
 * - Parses JSON response & throws on non-2xx status
 *
 * @param {string}  endpoint  – path after /api  (e.g. "/login", "/cars")
 * @param {object}  [options] – fetch options (method, body, headers …)
 * @returns {Promise<any>}    – parsed JSON response
 */
async function api(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  // Let callers handle 401 redirects if needed
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.detail || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export default api;
