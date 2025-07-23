import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../styles/EquipmentManagement.css";

const EquipmentManagement = () => {
  const [view, setView] = useState("viewEquipment");
  const [equipment, setEquipment] = useState([]);
  const [components, setComponents] = useState([]);

  // Fetch all equipment from the backend
  const fetchEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:5000/equipment");
      setEquipment(response.data || []);
    } catch (error) {
      alert("Failed to fetch equipment.");
    }
  };

  // Fetch all components from the backend
  const fetchComponents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/equipment/components");
      setComponents(response.data || []);
    } catch (error) {
      alert("Failed to fetch components.");
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchComponents();
  }, []);

  return (
    <div>
      <Header />
      <h2>Equipment Management</h2>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <button onClick={() => setView("viewEquipment")}>View Equipment</button>
        <button onClick={() => setView("viewComponents")}>View Components</button>
      </div>

      {/* Main Content */}
      <div className="content">
        {view === "viewEquipment" && (
          <div className="table-container">
            <h3>Equipment List</h3>
            {equipment.length === 0 ? (
              <p>No equipment found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Equipment ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Lifetime</th>
                    <th>Location</th>
                    <th>Purchase Cost</th>
                    <th>Purchase Date</th>
                    <th>Breakdown Cost</th>
                    <th>Shutdown Hours</th>
                    <th>Speciality</th>
                    <th>Specialization</th>
                  </tr>
                </thead>

                <tbody>
                  {equipment.map((eq, index) => (
                    <tr key={index}>
                      <td>{eq.equipmentId}</td>
                      <td>{eq.name}</td>
                      <td>{eq.description}</td>
                      <td>{eq.lifetime}</td>
                      <td>{eq.location}</td>
                      <td>{eq.purchaseCost}</td>
                      <td>{eq.purchaseDate}</td>
                      <td>{eq.breakdownCost}</td>
                      <td>{eq.shutdownHours}</td>
                      <td>{eq.speciality}</td>
                      <td>{eq.specialization}</td>
                    </tr>

                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {view === "viewComponents" && (
          <div className="table-container">
            <h3>Component List</h3>
            {components.length === 0 ? (
              <p>No components found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    {Object.keys(components[0]).map((key) => (
                      <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {components.map((comp, index) => (
                    <tr key={index}>
                      {Object.values(comp).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
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

export default EquipmentManagement;