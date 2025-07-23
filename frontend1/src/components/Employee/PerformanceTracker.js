import React, { useEffect, useState } from "react";
import axios from "axios";

const PerformanceTracker = () => {
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/employee-performance")
      .then(response => setPerformance(response.data))
      .catch(error => console.error("Error fetching performance data:", error));
  }, []);

  return (
    <div>
      <h2>Employee Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Jobs Completed</th>
            <th>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {performance.map(emp => (
            <tr key={emp.SSN}>
              <td>{emp.Name}</td>
              <td>{emp.JobsCompleted}</td>
              <td>{emp.HoursWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTracker;
