import { Routes, Route } from "react-router-dom";
import PublicLayout from "./modules/public/PublicLayout";
import DealerLayout from "./modules/dealer/DealerLayout";
import Home from "./modules/public/pages/Home";
import Marketplace from "./modules/public/pages/InventoryPage";
import Dealers from "./modules/public/pages/DealerPage";
import DealerProfile from "./modules/public/pages/DealerProfile";
import VehicleDetail from "./modules/public/pages/VehicleDetails";
import DealerRegistration from "./modules/public/pages/DealerRegister";
import LaunchPreview from "./modules/public/pages/LaunchPreview";
import DealerDashboard from "./modules/dealer/pages/DealerDashboard";
import DealerLogin from "./modules/dealer/pages/DealerLogin";
import AddCar from "./modules/dealer/pages/AddCar";
import MyCars from "./modules/dealer/pages/MyCars";
import EditCar from "./modules/dealer/pages/EditCar";
import DealerVehicleDetail from "./modules/dealer/pages/DealerVehicleDetail";
import DealerLeads from "./modules/dealer/pages/DealerLeads";
import DealerLeadDetail from "./modules/dealer/pages/DealerLeadDetail";
import StaffManagement from "./modules/dealer/pages/StaffManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetail />} />
        <Route path="dealers/:dealerId" element={<DealerProfile />} />
        <Route path="dealers" element={<Dealers />} />
        <Route path="dealer/register" element={<DealerRegistration />} />
        <Route path="launch-preview" element={<LaunchPreview />} />
      </Route>

      <Route path="/dealer/login" element={<DealerLogin />} />
      <Route path="/dealer/register" element={<DealerRegistration />} />

      <Route path="/dealer" element={<DealerLayout />}>
        <Route path="dashboard" element={<DealerDashboard />} />
        <Route path="vehicles/add" element={<AddCar />} />
        <Route path="vehicles" element={<MyCars />} />
        <Route path="vehicles/:vehicleId" element={<DealerVehicleDetail />} />
        <Route path="vehicles/:id/edit" element={<EditCar />} />
        <Route path="leads" element={<DealerLeads />} />
        <Route path="leads/:leadId" element={<DealerLeadDetail />} />
        <Route path="staff" element={<StaffManagement />} />
      </Route>
    </Routes>
  );
}

export default App;

