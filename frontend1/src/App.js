import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminOverview from "./pages/admin/Overview";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import EquipmentManagement from "./pages/admin/EquipmentManagement";
import MaintenanceTasks from "./pages/admin/MaintenanceTasks";
import MaintenanceCompanies from "./pages/admin/MaintenanceCompanies";
import Reports from "./pages/admin/Reports";
import Navbar from "./components/Navbar";
import EmployeeProfile from "./pages/employee/EmployeeProfile"; 
import ViewEmployee from "./pages/employee/ViewEmployee";
import ViewEquipment from "./pages/employee/ViewEquipment";
import ViewMaintenance from "./pages/employee/ViewMaintenance";
import ViewRecords from "./pages/employee/ViewRecords";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Admin Feature Pages */}
        <Route path="/admin/overview" element={<AdminOverview />} />
        <Route path="/admin/employees" element={<EmployeeManagement />} />
        <Route path="/admin/equipment" element={<EquipmentManagement />} />
        <Route path="/admin/maintenance" element={<MaintenanceTasks />} />
        <Route path="/admin/companies" element={<MaintenanceCompanies />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/*Employee Page Features*/}
        <Route path="/employee/profile/:ssn" element={<EmployeeProfile />} /> 
        <Route path="/employee/employees" element={<ViewEmployee />} />
        <Route path="/employee/equipments" element={<ViewEquipment />} />
        <Route path="/employee/maintenance" element={<ViewMaintenance />} />
        <Route path="/employee/records" element={<ViewRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
