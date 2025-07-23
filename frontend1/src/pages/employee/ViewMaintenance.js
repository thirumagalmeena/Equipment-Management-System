import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/EquipmentManagement.css";

const MaintenanceTaskManagement = () => {
    const [view, setView] = useState("assign");
    const [pendingMaintenance, setPendingMaintenance] = useState([]);
    const [selectedMaintenance, setSelectedMaintenance] = useState("");
    const [message, setMessage] = useState("");
    const [maintenanceStatus, setMaintenanceStatus] = useState([]);
    const [downtimeData, setDowntimeData] = useState([]);
    const [costData, setCostData] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [editMaintenance, setEditMaintenance] = useState({ id: "", name: "", description: "", status: "" });

    useEffect(() => {
        if (view === "assign") fetchPendingMaintenance();
        else if (view === "status") fetchMaintenanceStatus();
        else if (view === "downtime") fetchDowntime();
        else if (view === "cost") fetchCostData();
        else if (view === "edit") fetchMaintenanceStatus();
        else if (view === "assigned") fetchAssignedEmployees();
    }, [view]);

    // Fetch pending maintenance tasks
    const fetchPendingMaintenance = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assign_maintenance/pending");
            setPendingMaintenance(response.data || []);
        } catch (error) {
            console.error("Error fetching maintenance tasks:", error);
            alert("Failed to fetch maintenance tasks. Check the server.");
        }
    };

    const fetchAssignedEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assign_maintenance/assigned-employees");
            setAssignedEmployees(response.data || []);
        } catch (error) {
            console.error("Error fetching assigned employees:", error);
        }
    };

    const handleDelete = async (maintenanceID) => {
        if (!window.confirm("Are you sure you want to delete this maintenance task?")) return;
        
        try {
            const response = await axios.delete(`http://localhost:5000/assign_maintenance/delete/${maintenanceID}`);
            if (response.data.status === "success") {
                alert("Maintenance task deleted successfully.");
                setMaintenanceStatus(maintenanceStatus.filter(task => task.MaintenanceID !== maintenanceID));
            } else {
                alert("Failed to delete maintenance task.");
            }
        } catch (error) {
            console.error("Error deleting maintenance task:", error);
            alert("Failed to delete maintenance task.");
        }
    };
    

    // Handle selecting a maintenance task
    const handleSelectionChange = (e) => {
        setSelectedMaintenance(e.target.value);
    };

    // Assign maintenance task
    const [isAssigning, setIsAssigning] = useState(false);

    const handleAssign = async () => {
        if (!selectedMaintenance) {
            setMessage("⚠️ Please select a maintenance task.");
            return;
        }
        if (isAssigning) return; // Prevent multiple clicks
        
        setIsAssigning(true);
        console.log("Assign clicked");
    
        try {
            const response = await axios.post(`http://localhost:5000/assign_maintenance/${selectedMaintenance}`);
            console.log(response.data);
            
            if (response.data.status === "success") {  
                setMessage("✅ Maintenance assigned successfully!");
                setPendingMaintenance(pendingMaintenance.filter(task => task.MaintenanceID !== parseInt(selectedMaintenance)));
                setSelectedMaintenance("");
            } else {
                setMessage("⚠️ No available employees. Redirecting...");
                window.location.href = "/employees-not-available";
            }
        } catch (error) {
            console.error("Error assigning maintenance:", error);
            alert("Failed to assign maintenance.");
        } finally {
            setIsAssigning(false);
        }
    };
    
        // Fetch Maintenance Status
    const fetchMaintenanceStatus = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assign_maintenance/status");
            setMaintenanceStatus(response.data || []);
        } catch (error) {
            console.error("Error fetching maintenance status:", error);
        }
    };

    // Fetch Downtime Data
    const fetchDowntime = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assign_maintenance/downtime");
            setDowntimeData(response.data || []);
        } catch (error) {
            console.error("Error fetching downtime data:", error);
        }
    };

    // Fetch Cost Breakdown
    const fetchCostData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/assign_maintenance/cost");
            setCostData(response.data || []);
        } catch (error) {
            console.error("Error fetching cost breakdown:", error);
        }
    };

    const handleEditMaintenance = async () => {
        if (!editMaintenance.MaintenanceID) {
            return alert("Select a maintenance task to edit!");
        }
    
        try {
            await axios.put(`http://localhost:5000/assign_maintenance/edit/${editMaintenance.MaintenanceID}`, {
                status: editMaintenance.Status, // Ensure consistency with backend
            });
    
            alert("Status updated successfully!");
            setEditMaintenance({ MaintenanceID: "", Name: "", Description: "", Status: "" });
            fetchMaintenanceStatus();
        } catch (error) {
            console.error("Error updating maintenance:", error);
            alert("Failed to update maintenance.");
        }
    };
    

    return (
        <div>
            <h2>Maintenance Task Management</h2>
            <div className="sidebar">

                <button onClick={() => setView("status")}>View Maintenance Status</button>
                <button onClick={() => setView("downtime")}>Monitor Downtime</button>
                <button onClick={() => setView("cost")}>View Cost Breakdown</button>
                <button onClick={() => setView("assigned")}>View Assigned Employees</button>
            </div>

            <div className="content">
                {view === "assign" && (
                    <div>
                        <h3>Assign Maintenance</h3>
                        <p>Select an equipment maintenance task to assign.</p>

                        <select 
                            value={selectedMaintenance} 
                            onChange={handleSelectionChange} 
                            style={{ marginRight: "10px", padding: "5px" }}
                        >
                            <option value="">Select Maintenance</option>
                            {pendingMaintenance.length > 0 ? (
                                pendingMaintenance.map((task) => (
                                    <option key={task.MaintenanceID} value={task.MaintenanceID}>
                                        {task.Name} ({task.Status})
                                    </option>
                                ))
                            ) : (
                                <option disabled>No pending maintenance</option>
                            )}
                        </select>

                        <button 
                            onClick={handleAssign} 
                            style={{ cursor: "pointer", padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none" }}
                        >
                            Assign
                        </button>

                        <p>{message}</p>
                    </div>
                )}
                
                {view === "edit" && (
                        <div>
                                <h3>Edit Maintenance</h3>
        <p>Modify maintenance status.</p>

        <select
            onChange={(e) => {
                const selected = maintenanceStatus.find(m => m.MaintenanceID === parseInt(e.target.value, 10));
                setEditMaintenance(selected || { MaintenanceID: "", Name: "", Description: "", Status: "" });
            }}
        >
            <option value="">Select Maintenance</option>
            {maintenanceStatus.map((task) => (
                <option key={task.MaintenanceID} value={task.MaintenanceID}>
                    {task.Name} ({task.Status})
                </option>
            ))}
        </select>

        {editMaintenance?.MaintenanceID && (
            <div>
                <p><strong>Name:</strong> {editMaintenance.Name}</p>
                <p><strong>Description:</strong> {editMaintenance.Description}</p>

                <label>Status:</label>
                <select
                    value={editMaintenance.Status}
                    onChange={(e) => setEditMaintenance(prev => ({ ...prev, Status: e.target.value }))}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <button onClick={handleEditMaintenance}>Update Status</button>
            </div>
        )}
                    </div>
                )}

{view === "status" && (
    <div className="status-box">
        <h3>View Maintenance Status</h3>
        <table>
            <thead>
                <tr>
                    <th>Maintenance ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Equipment ID</th>
                    <th>Equipment Name</th>
                    <th>Actions</th> {/* New column for delete button */}
                </tr>
            </thead>
            <tbody>
                {maintenanceStatus.map((task) => (
                    <tr key={task.MaintenanceID}>
                        <td>{task.MaintenanceID}</td>
                        <td>{task.Name}</td>
                        <td>{task.Status}</td>
                        <td>{task.EquipmentID}</td>
                        <td>{task.EquipmentName}</td>
                        <td>
                            <button 
                                style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                                onClick={() => handleDelete(task.MaintenanceID)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

                {view === "downtime" && (
                    <div>
                        <h3>Monitor Downtime</h3>
                        <table>
                            <thead>
                                <tr><th>Equipment ID</th><th>Total Downtime (hrs)</th></tr>
                            </thead>
                            <tbody>
                                {downtimeData.map((item) => (
                                    <tr key={item.EquipmentID}>
                                        <td>{item.EquipmentID}</td>
                                        <td>{item.TotalDowntime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === "cost" && (
                    <div>
                        <h3>View Cost Breakdown</h3>
                        <table>
                            <thead>
                                <tr><th>Maintenance ID</th><th>Name</th><th>Cost ($)</th></tr>
                            </thead>
                            <tbody>
                                {costData.map((item) => (
                                    <tr key={item.MaintenanceID}>
                                        <td>{item.MaintenanceID}</td>
                                        <td>{item.Name}</td>
                                        <td>{item.Cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {view === "assigned" && (
                    <div>
                        <h3>Assigned Employees</h3>
                        <table>
                            <thead>
                                <tr><th>Maintenance ID</th><th>Maintenance Name</th><th>Equipment ID</th><th>Equipment Name</th><th>Employee ID</th><th>Employee Name</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {assignedEmployees.map((item) => (
                                    <tr key={item.EmployeeID}>
                                        <td>{item.MaintenanceID}</td>
                                        <td>{item.MaintenanceName}</td>
                                        <td>{item.EquipmentID}</td>
                                        <td>{item.EquipmentName}</td>
                                        <td>{item.EmployeeID}</td>
                                        <td>{item.EmployeeName}</td>
                                        <td>{item.Status}</td>
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

export default MaintenanceTaskManagement;
