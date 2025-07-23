import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../styles/EquipmentManagement.css";

const EmployeeManagement = () => {
    const [view, setView] = useState("add");
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        ssn: "",
        name: "",
        address: "",
        department: "",
        specialty: "",
        employmentDate: "",
        status: "",
    });

    // Fetch all employees
    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5000/employees/");
            setEmployees(response.data || []);
        } catch (error) {
            console.error("Error fetching employees:", error);
            alert("Failed to fetch employees. Check the server.");
        }
    };
    

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Reset form fields
    const resetForm = () => {
        setFormData({
            ssn: "",
            name: "",
            address: "",
            department: "",
            specialty: "",
            employmentDate: "",
            status: "",
        });
    };

    // Add employee
    const handleAddEmployee = async () => {
        const { ssn, name, address, department, specialty, employmentDate, status } = formData;

        // Ensure required fields are filled
        if (!ssn || !name || !department || !employmentDate || !status) {
            alert("SSN, Name, Department, and Employment Date are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/employees/", formData);
            alert(response.data.message);
            resetForm();
            fetchEmployees();
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Failed to add employee.");
        }
    };

// Fetch employee details for editing
const fetchEmployeeDetails = async () => {
    if (!formData.ssn) {
        alert("Please enter an SSN to fetch details!");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:5000/employees/${formData.ssn}`);
        if (response.data) {
            setFormData(response.data); // Ensure the response structure matches formData
        }
    } catch (error) {
        console.error("Error fetching employee details:", error);
        alert("Employee not found!");
    }
};


    // Update employee
    const handleEditEmployee = async () => {
        if (!formData.ssn) {
            alert("Enter SSN to update an employee!");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/employees/${formData.ssn}`, formData);
            alert(response.data.message);
            resetForm();
            fetchEmployees();
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Failed to update employee.");
        }
    };

    // Delete employee
    const handleDeleteEmployee = async (ssn) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                const response = await axios.delete(`http://localhost:5000/employees/${ssn}`);
                alert(response.data.message);
                fetchEmployees();
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee.");
            }
        }
    };

    return (
        <div>
            <h2>Employee Management</h2>
            <div className="sidebar">
                <button onClick={() => { setView("add"); resetForm(); }}>Add Employee</button>
                <button onClick={() => { setView("edit"); resetForm(); }}>Edit Employee</button>
                <button onClick={() => setView("view")}>View Employees</button>
            </div>

            <div className="content">
                {view === "add" && (
                    <div>
                        <h3>Add Employee</h3>
                        <input name="ssn" placeholder="SSN" value={formData.ssn} onChange={handleInputChange} />
                        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                        <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
                        <input name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} />
                        <input name="specialty" placeholder="Specialty" value={formData.specialty} onChange={handleInputChange} />
                        <input name="employmentDate" placeholder="Employment Date" type="date" value={formData.employmentDate} onChange={handleInputChange} />
                        <input name="status" placeholder="Status" value={formData.status} onChange={handleInputChange} />
                        <button onClick={handleAddEmployee}>Add</button>
                    </div>
                )}

                {view === "edit" && (
                    <div>
                        <h3>Edit Employee</h3>
                        <input name="ssn" placeholder="Enter SSN to Edit" value={formData.ssn} onChange={handleInputChange} />
                        <button onClick={fetchEmployeeDetails}>Fetch Details</button>

                        {formData.name && (
                            <>
                                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                                <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
                                <input name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} />
                                <input name="specialty" placeholder="Specialty" value={formData.specialty} onChange={handleInputChange} />
                                <input name="employmentDate" placeholder="Employment Date" type="date" value={formData.employmentDate} onChange={handleInputChange} />
                                <input name="status" placeholder="Status" value={formData.status} onChange={handleInputChange} />                                
                                <button onClick={handleEditEmployee}>Update</button>
                            </>
                        )}
                    </div>
                )}

                {view === "view" && (
                    <div>
                        <h3>Employee List</h3>
                        {employees.length === 0 ? (
                            <p>No employees found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>SSN</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Department</th>
                                        <th>Specialty</th>
                                        <th>Employment Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(emp => (
                                        <tr key={emp.ssn}>
                                            <td>{emp.ssn}</td>
                                            <td>{emp.name}</td>
                                            <td>{emp.address}</td>
                                            <td>{emp.department}</td>
                                            <td>{emp.specialty}</td>
                                            <td>{emp.employmentDate}</td>
                                            <td>{emp.status || "N/A"}</td>
                                            <td>
                                                <button onClick={() => handleDeleteEmployee(emp.ssn)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeManagement;
