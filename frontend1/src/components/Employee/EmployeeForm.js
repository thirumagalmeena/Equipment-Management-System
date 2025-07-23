import React, { useState } from "react";
import axios from "axios";

const EmployeeForm = ({ employee, onSave }) => {
  const [formData, setFormData] = useState(
    employee || { SSN: "", Name: "", Address: "", Department: "", Specialty: "", EmploymentDate: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employee) {
      axios.put(`http://localhost:5000/employees/${formData.SSN}`, formData)
        .then(() => onSave())
        .catch(error => console.error("Error updating employee:", error));
    } else {
      axios.post("http://localhost:5000/employees", formData)
        .then(() => onSave())
        .catch(error => console.error("Error adding employee:", error));
    }
  };

  return (
    <div>
      <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="SSN" placeholder="SSN" value={formData.SSN} onChange={handleChange} required />
        <input type="text" name="Name" placeholder="Name" value={formData.Name} onChange={handleChange} required />
        <input type="text" name="Address" placeholder="Address" value={formData.Address} onChange={handleChange} />
        <input type="text" name="Department" placeholder="Department" value={formData.Department} onChange={handleChange} />
        <input type="text" name="Specialty" placeholder="Specialty" value={formData.Specialty} onChange={handleChange} />
        <input type="date" name="EmploymentDate" value={formData.EmploymentDate} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
