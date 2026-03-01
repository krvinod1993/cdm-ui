import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, toggleThemeClass } from '../utils/theme';

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return getStoredTheme() === 'dark';
  });

  /* Apply dark class + smooth transition on toggle */
  useEffect(() => {
    const root = document.documentElement;

    // Enable smooth transition during theme switch
    root.classList.add('theme-transitioning');

    applyTheme(isDark ? 'dark' : 'light');

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);

    return () => clearTimeout(timer);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const nextIsDark = toggleThemeClass();
      if (prev === nextIsDark) return prev;
      return nextIsDark;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
