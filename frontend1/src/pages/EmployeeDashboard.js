import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmpSidebar from "../components/EmpSidebar.js";
import Card from "../components/card.js";
import "../styles/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const userID = localStorage.getItem("userID"); // ✅ Retrieve userID

  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeData, setEmployeeData] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [pendingMaintenance, setPendingMaintenance] = useState(0);
  const [recentEquipment, setRecentEquipment] = useState("");

  useEffect(() => {
    if (!userID) {
      navigate("/login"); // ✅ Redirect if userID is missing
      return;
    }

    fetch(`http://localhost:5000/employees/get_employee/${userID}`)
      .then((res) => res.json())
      .then((data) => setEmployeeData(data))
      .catch((err) => console.error("Error fetching employee data:", err));

    fetch(`http://localhost:5000/employees/get_assigned_tasks/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        setAssignedTasks(data.assigned_tasks || []);
        setPendingMaintenance(data.pending_maintenance || 0);
        setRecentEquipment(data.recent_equipment || "N/A");
      })
      .catch((err) => console.error("Error fetching assigned tasks:", err));

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [userID]);

  const handleLogout = () => {
    localStorage.removeItem("userID"); // ✅ Clear user data
    navigate("/login"); // ✅ Redirect to login
  };

  return (
    <div className="employee-dashboard-page">
      <div className="dashboard-container">
        <EmpSidebar /> {/* ✅ Sidebar does not need userID in props */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h2>Welcome, { "Loading..." }</h2>
            <p>{currentTime.toLocaleString()}</p>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
  
          {/* Quick Stats */}
          <div className="stats-container">
            <Card title="Total Assigned Tasks" value={assignedTasks.length} />
            <Card title="Pending Maintenance" value={pendingMaintenance} />
            <Card title="Recent Equipment Handled" value={recentEquipment || "N/A"} />
          </div>
  
          {/* Dashboard Sections */}
          <div className="section-container">
            <Card title="Maintenance Logs & Reports" description="Log maintenance activities." onClick={() => navigate(`/employee/maintenance`)} />
          
            <Card title="View All Employees" description="View all employees." onClick={() => navigate(`/employee/employees`)} />
            <Card title="View All Equipments and Components" description="View all equipment and components." onClick={() => navigate(`/employee/equipments`)} />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default EmployeeDashboard;
