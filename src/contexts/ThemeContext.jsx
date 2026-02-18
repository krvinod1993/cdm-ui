import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // default dark (matches existing UI)
  });

  /* Apply dark class + smooth transition on toggle */
  useEffect(() => {
    const root = document.documentElement;

    // Enable smooth transition during theme switch
    root.classList.add('theme-transitioning');

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);

    return () => clearTimeout(timer);
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
