import React, { useEffect, useState } from "react";


const AdminOverview = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/overview/")
      .then((response) => response.json())
      .then((data) => setOverview(data))
      .catch((error) => console.error("Error fetching overview data:", error));
  }, []);

  if (!overview) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="overview-container">
      <h2>Admin Dashboard Overview</h2>
      <div className="overview-grid">
        <div className="card">Total Equipment: {overview.total_equipment}</div>
        <div className="card">Active Maintenance Tasks: {overview.active_maintenance_tasks}</div>
        <div className="card">Total Employees: {overview.total_employees}</div>
        <div className="card">Breakdown Maintenance: {overview.total_breakdown}</div>
        <div className="card">Shutdown Maintenance: {overview.total_shutdown}</div>
        <div className="card">
  Monthly Maintenance Cost: ${Number(overview.monthly_maintenance_cost || 0).toFixed(2)}
</div>

<div className="card high-maintenance">
  <strong>🚨 High Maintenance Equipment:</strong> {overview.high_maintenance_alert.Name || "N/A"} 
  (Cost: ${Number(overview.high_maintenance_alert.BreakdownCost || 0).toFixed(2)})
</div>

      </div>
    </div>
  );
};

export default AdminOverview;
