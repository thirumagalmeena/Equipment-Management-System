import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EmployeeProfile = () => {
  let { ssn } = useParams();  
  console.log("🔍 Debug: SSN from URL →", ssn); 

  if (!ssn) {
    ssn = localStorage.getItem("userID"); 
    console.log("🔄 Fallback: SSN from localStorage →", ssn);
  }

  if (!ssn || isNaN(parseInt(ssn, 10))) {
    console.error("❌ Invalid SSN:", ssn);
  }

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employees/${ssn}`);
        console.log("✅ Employee data fetched:", response.data); // ✅ Debugging log
        setEmployee(response.data); // ✅ Store response in state
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Employee not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [ssn]);

  return (
    <div className="profile-container">
      <h2>Employee Profile</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {employee ? ( // ✅ Check if employee data exists
        <div>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Address:</strong> {employee.address}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Specialty:</strong> {employee.specialty}</p>
          <p><strong>Employment Date:</strong> {employee.employmentDate}</p>
        </div>
      ) : (
        !loading && <p>No employee data available.</p> // ✅ Show message if no data
      )}
    </div>
  );
};

export default EmployeeProfile;
