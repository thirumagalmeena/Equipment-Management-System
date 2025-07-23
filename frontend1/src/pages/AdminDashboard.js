import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Header />
      <div className="grid">
        <button onClick={() => navigate("/admin/overview")}>
          🏠 Overview & Statistics
        </button>
        <button onClick={() => navigate("/admin/employees")}>
          👨‍🔧 Employee Management
        </button>
        <button onClick={() => navigate("/admin/equipment")}>
          🏭 Equipment & Component Management
        </button>
        <button onClick={() => navigate("/admin/maintenance")}>
          🛠 Maintenance Task Management
        </button>
        <button onClick={() => navigate("/admin/companies")}>
          🏢 Maintenance Company Management
        </button>
        <button onClick={() => navigate("/admin/reports")}>
          📈 Reports & Data Analysis
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
