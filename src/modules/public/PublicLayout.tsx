import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import { useTheme } from '../../shared/contexts/ThemeContext';

function PublicLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="text-gray-900 dark:text-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;

