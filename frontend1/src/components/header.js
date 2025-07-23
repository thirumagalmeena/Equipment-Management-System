import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="navbar">
      <h1>Equipment Maintenance System</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};
export default Header; 
