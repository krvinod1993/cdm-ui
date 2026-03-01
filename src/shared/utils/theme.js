const THEME_STORAGE_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

export function getStoredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
    return savedTheme;
  }
  return DARK_THEME;
}

export function applyTheme(theme) {
  const isDark = theme === DARK_THEME;
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? DARK_THEME : LIGHT_THEME);
  return isDark;
}

export function toggleThemeClass() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? DARK_THEME : LIGHT_THEME);
  return isDark;
}

