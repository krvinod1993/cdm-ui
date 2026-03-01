import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Role = 'user' | 'dealer';

type AuthUser = {
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem('auth_user');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
      return;
    }
    localStorage.removeItem("auth_user");
  }, [user]);

  const openAuthModal = useCallback(() => {
    setIsAuthOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  const login = useCallback((role: Role) => {
    setUser({
      name: role === 'dealer' ? 'Dealer' : 'User',
      role,
    });
    setIsAuthOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthOpen(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthOpen,
      openAuthModal,
      closeAuthModal,
      login,
      logout,
    }),
    [user, isAuthOpen, openAuthModal, closeAuthModal, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
