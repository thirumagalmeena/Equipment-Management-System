import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../styles/EquipmentManagement.css";

const EquipmentManagement = () => {
  const [view, setView] = useState("add");
  const [equipment, setEquipment] = useState([]);
  const [components, setComponents] = useState([]); 

  const [formData, setFormData] = useState({
    equipmentId: "",  // ✅ Added Equipment ID
    name: "",
    description: "",
    location: "",
    purchaseCost: "",
    purchaseDate: "",
    breakdownCost: "",
    shutdownHours: "",
    lifetime: "",
    speciality: "",
    specialization: "",
  });
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");

  const [componentData, setComponentData] = useState({
    componentId: "",
    componentName: "",
    equipmentId: "",
    purchaseDate: "",
    lifetime: "",
    inventoryLevel: "",
    unitCost: "",
    supplierName: "",
    contactPerson: "",
    contactTelephone: ""
  });
  
  
  // ✅ Fetch all equipment from the backend
  const fetchEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:5000/equipment");
      setEquipment(response.data || []);
    } catch (error) {
      alert("Failed to fetch equipment.");
    }
  };

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

  // ✅ Handle input field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComponentInputChange = (e) => {
    setComponentData({ ...componentData, [e.target.name]: e.target.value });
  };
  

  // ✅ Reset form data
  const resetForm = () => {
    setFormData({
      equipmentId: "",  // ✅ Reset ID
      name: "",
      description: "",
      location: "",
      purchaseCost: "",
      purchaseDate: "",
      breakdownCost: "",
      shutdownHours: "",
      lifetime: "",
      speciality: "",
      specialization: "",
    });
    setSelectedEquipmentId("");
  };

  // ✅ Add Equipment
  const handleAddEquipment = async () => {
    const formattedData = {
      ...formData,
      equipmentId: Number(formData.equipmentId), // Convert to integer
      purchaseCost: Number(formData.purchaseCost), // Convert to float
      breakdownCost: Number(formData.breakdownCost),
      shutdownHours: Number(formData.shutdownHours),
      lifetime: Number(formData.lifetime),
    };
  
    console.log("Sending Data:", formattedData); // Debugging step
  
    try {
      await axios.post("http://localhost:5000/equipment/", formattedData);
      alert("Equipment added successfully!");
      resetForm();
      fetchEquipment();
    } catch (error) {
      alert("Failed to add equipment. Ensure ID is unique.");
      console.error(error.response ? error.response.data : error.message);
    }
  };
  
  const handleAddComponent = async () => {
    if (!componentData.equipmentId) {
      alert("Equipment ID is required!");
      return;
    }
  
    const formattedData = {
      ...componentData,
      componentId: Number(componentData.componentId), // Convert to integer
      equipmentId: Number(componentData.equipmentId), // Convert to integer
      lifetime: Number(componentData.lifetime), // Convert to integer
      inventoryLevel: Number(componentData.inventoryLevel), // Convert to integer
      unitCost: Number(componentData.unitCost), // Convert to float
    };
  
    console.log("Sending Component Data:", formattedData); // ✅ Debugging step
  
    try {
      const response = await axios.post(
        "http://localhost:5000/equipment/components",
        formattedData
      );
  
      alert(response.data.message);
      fetchComponents();
      setComponentData({
        componentId: "",
        componentName: "",
        equipmentId: "",
        purchaseDate: "",
        lifetime: "",
        inventoryLevel: "",
        unitCost: "",
        supplierName: "",
        contactPerson: "",
        contactTelephone: "",
      });
    } catch (error) {
      console.error("Error adding component:", error.response ? error.response.data : error.message);
      alert("Failed to add component.");
    }
  };
  

  // ✅ Fetch equipment details for editing
  const fetchEquipmentDetails = async () => {
    if (!selectedEquipmentId) {
      alert("Enter an Equipment ID");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/equipment/${selectedEquipmentId}`);
      
      if (!response.data) {
        alert("Equipment not found!");
        return;
      }

      setFormData(response.data);
    } catch (error) {
      alert("Equipment not found!");
    }
  };

  // ✅ Edit Equipment
  const handleEditEquipment = async () => {
    if (!selectedEquipmentId) {
      alert("Enter an Equipment ID");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/equipment/${selectedEquipmentId}`, formData);
      alert("Equipment updated successfully!");
      fetchEquipment();
    } catch (error) {
      alert("Failed to update equipment.");
    }
  };

  // ✅ Delete Equipment
  const handleDeleteEquipment = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/equipment/${id}`);
        fetchEquipment();
      } catch (error) {
        alert("Failed to delete equipment.");
      }
    }
  };

  return (
    <div>
      <Header />
      <h2>Equipment Management</h2>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <button onClick={() => { setView("add"); resetForm(); }}>Add Equipment</button>
        <button onClick={() => { setView("edit"); resetForm(); }}>Edit Equipment</button>
        <button onClick={() => setView("viewEquipment")}>View Equipment</button>
        <button onClick={() => setView("addComponent")}>Add Component</button>
        <button onClick={() => setView("viewComponents")}>View Component</button>
      </div>

      {/* Main Content */}
      <div className="content">
        {view === "add" && (
          <div className="form-container">
            <h3>Add Equipment</h3>
            <input
              name="equipmentId"
              placeholder="Equipment ID"
              value={formData.equipmentId}
              onChange={handleInputChange}
            />
            {Object.keys(formData).map((key) => (
              key !== "equipmentId" && (  
                key === "purchaseDate" ? (
                  <input
                    key={key}
                    name={key}
                    type="date"
                    value={formData[key]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    key={key}
                    name={key}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={formData[key]}
                    onChange={handleInputChange}
                    type={["purchaseCost", "breakdownCost", "shutdownHours", "lifetime"].includes(key) ? "number" : "text"}
                  />
                )
              )
            ))}
            <button onClick={handleAddEquipment}>Add</button>
          </div>
        )}

        {view === "edit" && (
          <div className="form-container">
            <h3>Edit Equipment</h3>
            <input
              name="equipmentId"
              placeholder="Enter Equipment ID"
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
            />
            <button onClick={fetchEquipmentDetails}>Fetch Details</button>

            {formData.name && (
              <>
                {Object.keys(formData).map((key) => (
                  key !== "equipmentId" && (
                    key === "purchaseDate" ? (
                      <input
                        key={key}
                        name={key}
                        type="date"
                        value={formData[key]}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <input
                        key={key}
                        name={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={formData[key]}
                        onChange={handleInputChange}
                        type={["purchaseCost", "breakdownCost", "shutdownHours", "lifetime"].includes(key) ? "number" : "text"}
                      />
                    )
                  )
                ))}
                <button onClick={handleEditEquipment}>Update</button>
              </>
            )}
          </div>
        )}

       
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
                    <th>Actions</th>
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
                      <td>
                        <button onClick={() => handleDeleteEquipment(eq.equipmentId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {view === "addComponent" && (
        <div className="form-container">
            <h3>Add Component</h3>
            <input
            name="equipmentId"
            placeholder="Equipment ID"
            value={componentData.equipmentId}
            onChange={handleComponentInputChange}
            />
            <input
            name="componentName"
            placeholder="Component Name"
            value={componentData.componentName}
            onChange={handleComponentInputChange}
            />
            <input
            name="purchaseDate"
            type="date"
            value={componentData.purchaseDate}
            onChange={handleComponentInputChange}
            />
            <input
            name="lifetime"
            type="number"
            placeholder="Lifetime"
            value={componentData.lifetime}
            onChange={handleComponentInputChange}
            />
            <input
            name="inventoryLevel"
            type="number"
            placeholder="Inventory Level"
            value={componentData.inventoryLevel}
            onChange={handleComponentInputChange}
            />
            <input
            name="unitCost"
            type="number"
            placeholder="Unit Cost"
            value={componentData.unitCost}
            onChange={handleComponentInputChange}
            />
            <input
            name="supplierName"
            placeholder="Supplier Name"
            value={componentData.supplierName}
            onChange={handleComponentInputChange}
            />
            <input
            name="contactPerson"
            placeholder="Contact Person"
            value={componentData.contactPerson}
            onChange={handleComponentInputChange}
            />
            <input
            name="contactTelephone"
            placeholder="Contact Telephone"
            value={componentData.contactTelephone}
            onChange={handleComponentInputChange}
            />
            <button onClick={handleAddComponent}>Add Component</button>
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
                    {components.length > 0 &&
                      Object.keys(components[0]).map((key) => (
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