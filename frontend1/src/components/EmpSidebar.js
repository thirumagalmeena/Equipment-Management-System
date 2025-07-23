import { Link } from "react-router-dom";
import "../styles/EmployeeDashboard.css";

const EmpSidebar = () => {
  let userID = localStorage.getItem("userID"); 
  console.log("🔍 Debug: Stored userID →", userID);

  if (!userID) {
    console.error("❌ Error: No userID found in localStorage!");
  } else if (isNaN(parseInt(userID, 10))) {
    console.error("❌ Error: Invalid userID (not a number) →", userID);
    userID = null; // Prevents invalid URL
  }

  return (
    <div className="emp-sidebar">
      <h3>Employee Panel</h3>
      {userID ? (  // ✅ Only render if userID is valid
        <Link to={`/employee/profile/${userID}`}>👤 Profile</Link>
      ) : (
        <p style={{ color: "red" }}>❌ Profile Unavailable</p>
      )}
      <Link to="/employee/settings">⚙️ Settings</Link>
      <Link to="/employee/notifications">📅 Schedule & Notifications</Link>
    </div>
  );
};

export default EmpSidebar;
