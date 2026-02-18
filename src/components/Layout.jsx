import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-[#0f0f0f] dark:text-white">
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-6 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
