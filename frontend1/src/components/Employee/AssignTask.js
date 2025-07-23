import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/employees").then(res => setEmployees(res.data));
    axios.get("http://localhost:5000/maintenance").then(res => setTasks(res.data));
  }, []);

  const handleAssign = () => {
    axios.post("http://localhost:5000/assign-task", { SSN: selectedEmployee, MaintenanceID: selectedTask })
      .then(() => alert("Task Assigned Successfully"))
      .catch(error => console.error("Error assigning task:", error));
  };

  return (
    <div>
      <h2>Assign Employee to Maintenance Task</h2>
      <select onChange={(e) => setSelectedEmployee(e.target.value)}>
        <option value="">Select Employee</option>
        {employees.map(emp => <option key={emp.SSN} value={emp.SSN}>{emp.Name}</option>)}
      </select>
      <select onChange={(e) => setSelectedTask(e.target.value)}>
        <option value="">Select Task</option>
        {tasks.map(task => <option key={task.MaintenanceID} value={task.MaintenanceID}>{task.Name}</option>)}
      </select>
      <button onClick={handleAssign}>Assign Task</button>
    </div>
  );
};

export default AssignTask;
