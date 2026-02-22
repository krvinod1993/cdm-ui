import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DealerLayout from './components/DealerLayout';
import AuthGuard from './components/AuthGuard';

import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import DealerPage from './pages/DealerPage';
import DealerDetails from './pages/DealerDetails';
import VehicleDetails from './pages/VehicleDetails';
import VehiclesPage from './pages/VehiclesPage';
import DealerLogin from './pages/DealerLogin';
import DealerRegister from './pages/DealerRegister';
import Dashboard from './pages/Dashboard';
import DealerDashboard from './pages/DealerDashboard';
import MyCars from './pages/MyCars';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import StaffManagement from './pages/StaffManagement';
import DealerLeads from './pages/DealerLeads';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* â”€â”€ Public routes (main site layout) â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<InventoryPage />} />
          <Route path="/inventory" element={<Navigate to="/marketplace" replace />} />
          <Route path="/dealers" element={<DealerPage />} />
          <Route path="/dealers/:id" element={<DealerDetails />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/dealer/login" element={<DealerLogin />} />
          <Route path="/register" element={<DealerRegister />} />
        </Route>

        {/* â”€â”€ Dealer dashboard (auth-guarded layout) â”€â”€ */}
        <Route
          path="/dealer"
          element={
            <AuthGuard>
              <DealerLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="overview" element={<DealerDashboard />} />
          <Route path="vehicles" element={<MyCars />} />
          <Route path="vehicles/add" element={<AddCar />} />
          <Route path="vehicles/:id" element={<EditCar />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="leads" element={<DealerLeads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
