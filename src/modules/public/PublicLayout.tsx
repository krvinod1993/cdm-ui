import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import { useTheme } from '../../shared/contexts/ThemeContext';

function PublicLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navbar isDark={isDark} toggleTheme={toggleTheme} embedded />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 text-gray-900 dark:text-gray-100 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;

