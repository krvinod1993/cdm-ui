import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /* -- Fetch current user from /api/me -- */
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setPermissions([]);
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);
    try {
      const data = await api('/me');
      setUser({
        id: data.id,
        email: data.email,
        role: data.role,
        dealer_id: data.dealer_id,
      });
      setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
    } catch {
      // Token invalid / expired — clear it silently
      localStorage.removeItem('access_token');
      setUser(null);
      setPermissions([]);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  /* -- Load user on mount -- */
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  /* -- Check a single permission code -- */
  const hasPermission = useCallback(
    (code) => permissions.includes(code),
    [permissions],
  );

  /* -- Logout: clear token + reset state -- */
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
    setPermissions([]);
  }, []);

  /* -- Re-fetch /me (call after login to hydrate context) -- */
  const refreshAuth = useCallback(() => {
    setIsAuthLoading(true);
    return fetchMe();
  }, [fetchMe]);

  const value = useMemo(
    () => ({ user, permissions, isAuthLoading, hasPermission, logout, refreshAuth }),
    [user, permissions, isAuthLoading, hasPermission, logout, refreshAuth],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
