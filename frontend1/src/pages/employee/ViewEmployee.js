import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/EquipmentManagement.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:5000/employees/");
                setEmployees(response.data || []);
            } catch (err) {
                setError("Failed to fetch employees. Check the server.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>Employee List</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && employees.length === 0 && <p>No employees found.</p>}
            {!loading && employees.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>SSN</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Department</th>
                            <th>Specialty</th>
                            <th>Employment Date</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;
