import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = ({ onEdit }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/employees")
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  const deleteEmployee = (ssn) => {
    axios.delete(`http://localhost:5000/employees/${ssn}`)
      .then(() => setEmployees(employees.filter(emp => emp.SSN !== ssn)))
      .catch(error => console.error("Error deleting employee:", error));
  };

  return (
    <div>
      <h2>Employee Management</h2>
      <table>
        <thead>
          <tr>
            <th>SSN</th><th>Name</th><th>Department</th><th>Specialty</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.SSN}>
              <td>{emp.SSN}</td>
              <td>{emp.Name}</td>
              <td>{emp.Department}</td>
              <td>{emp.Specialty}</td>
              <td>
                <button onClick={() => onEdit(emp)}>Edit</button>
                <button onClick={() => deleteEmployee(emp.SSN)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
