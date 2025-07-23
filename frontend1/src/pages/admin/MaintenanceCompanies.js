import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/EquipmentManagement.css";

const MaintenanceCompanyManagement = () => {
  const [view, setView] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [outsourcedWork, setOutsourcedWork] = useState([]);
  const [maintenanceId, setMaintenanceId] = useState("");
  const [showAssign, setShowAssign] = useState(false);

  // Fetch Maintenance Companies
  useEffect(() => {
    fetch("http://localhost:5000/company/companies")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  // Fetch Outsourced Work
  useEffect(() => {
    fetch("http://localhost:5000/company/outsourced-work")
      .then((response) => response.json())
      .then((data) => setOutsourcedWork(data))
      .catch((error) => console.error("Error fetching outsourced work:", error));
  }, []);

  const assignMaintenance = async () => {
    if (!maintenanceId) {
      alert("Enter a valid Maintenance ID");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/company/assign_company", {
        maintenance_id: maintenanceId,
      });
      alert(response.data.message);
      setMaintenanceId(""); // Clear input after assignment
    } catch (error) {
      alert("Error: " + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Company & Outsourced Work Management</h2>

      {/* Top Navigation */}
      <div className="top-navigation">
        <button onClick={() => setView("companies")}>View Companies</button>
        <button onClick={() => setView("outsourced")}>Track Outsourced Work</button>
        <button onClick={() => setShowAssign(!showAssign)}>Assign Maintenance</button>
      </div>

      {/* Assign Maintenance Section */}
      {showAssign && (
        <div className="assign-section">
          <input
            type="number"
            placeholder="Enter Maintenance ID"
            value={maintenanceId}
            onChange={(e) => setMaintenanceId(e.target.value)}
          />
          <button onClick={assignMaintenance}>Assign</button>
        </div>
      )}

      {/* Content Area */}
      <div className="content">
        {view === "companies" && (
          <div>
            <h3>Maintenance Companies</h3>
            <table>
              <thead>
                <tr>
                  <th>Company ID</th>
                  <th>Company Name</th>
                  <th>Address</th>
                  <th>Contact Person</th>
                  <th>Telephone</th>
                  <th>Services Provided</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.CompanyID}>
                    <td>{company.CompanyID}</td>
                    <td>{company.Name}</td>
                    <td>{company.Address}</td>
                    <td>{company.ContactPerson}</td>
                    <td>{company.ContactTelephone}</td>
                    <td>{company.ServicesProvided}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "outsourced" && (
          <div>
            <h3>Outsourced Maintenance Work</h3>
            <table>
              <thead>
                <tr>
                  <th>Maintenance ID</th>
                  <th>Hours Worked</th>
                  <th>Company Name</th>
                  <th>Contact Person</th>
                  <th>Telephone</th>
                </tr>
              </thead>
              <tbody>
                {outsourcedWork.map((work) => (
                  <tr key={work.MaintenanceID}>
                    <td>{work.MaintenanceID}</td>
                    <td>{work.HoursWorked}</td>
                    <td>{work.CompanyName}</td>
                    <td>{work.ContactPerson}</td>
                    <td>{work.ContactTelephone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceCompanyManagement;
