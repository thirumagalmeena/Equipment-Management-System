import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "employee") {
      navigate("/employee-dashboard"); // Pass only userID in the URL
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
