import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa"; // Importing icons
import "../styles/LoginPage.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();
      console.log("🔍 Debug: Login Response →", data); // ✅ Log response

      if (data.success) {
        alert(data.message);

        // ✅ Convert username to number if it's numeric
        let storedUserID = isNaN(username) ? username : parseInt(username, 10);
        localStorage.setItem("userID", storedUserID);
        console.log("✅ Stored userID:", storedUserID);

        if (role === "employee") {
          navigate("/employee-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Error logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
          <option value="employee">Employee</option>
          <option value="administrator">Administrator</option>
        </select>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
