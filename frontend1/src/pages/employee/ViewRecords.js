import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../styles/EquipmentManagement.css";

const ViewRecords = () => {
  const [view, setView] = useState("maintenanceRecords");
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [componentReplacements, setComponentReplacements] = useState([]);

  // Fetch all maintenance records from the backend
  const fetchMaintenanceRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/records/maintenance_records");
      setMaintenanceRecords(response.data || []);
    } catch (error) {
      console.error("Failed to fetch maintenance records:", error);
      alert("Failed to fetch maintenance records.");
    }
  };

  // Fetch all component replacements from the backend
  const fetchComponentReplacements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/records/component_replacements");
      setComponentReplacements(response.data || []);
    } catch (error) {
      alert("Failed to fetch component replacements.");
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchComponentReplacements();
  }, []);

  return (
    <div>
      <Header />
      <h2>Records Management</h2>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <button onClick={() => setView("maintenanceRecords")}>View Maintenance Records</button>
        <button onClick={() => setView("componentReplacements")}>View Component Replacements</button>
      </div>

      {/* Main Content */}
      <div className="content">
        {view === "maintenanceRecords" && (
          <div className="table-container">
            <h3>Maintenance Records</h3>
            {maintenanceRecords.length === 0 ? (
              <p>No maintenance records found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Maintenance ID</th>
                    <th>Hours Worked</th>
                    <th>Employee ID</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.maintenanceId}</td>
                      <td>{record.hoursWorked}</td>
                      <td>{record.employeeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {view === "componentReplacements" && (
          <div className="table-container">
            <h3>Component Replacement Logs</h3>
            {componentReplacements.length === 0 ? (
              <p>No component replacements found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Replacement ID</th>
                    <th>Component ID</th>
                    <th>Equipment ID</th>
                    <th>Replacement Date</th>
                    <th>Man Hours Used</th>
                    <th>Quantity Used</th>
                  </tr>
                </thead>
                <tbody>
                  {componentReplacements.map((record, index) => (
                    <tr key={index}>
                      <td>{record.replacementId}</td>
                      <td>{record.componentId}</td>
                      <td>{record.equipmentId}</td>
                      <td>{record.replacementDate}</td>
                      <td>{record.manHoursUsed}</td>
                      <td>{record.quantityUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewRecords;