import { useState } from "react";
import { useNavigate } from "react-router-dom";

const newLocal = "admin@gmail.com";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setMessage("Email and Password are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Enter a valid email");
      return;
    }

    // ✅ Dummy auth
    if (email === newLocal && password === "admin123") {
      setMessage("Login Successfully");
      localStorage.setItem("isLoggedIn", "true"); // persist login
      navigate("/"); // redirect to Dashboard
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      {message && <div style={errorStyle}>{message}</div>}
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleLogin} style={buttonStyle}>Login</button>
    </div>
  );
};

const containerStyle = { maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "Arial, sans-serif" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" };
const buttonStyle = { width: "100%", padding: "8px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const errorStyle = { color: "red", marginBottom: "10px" };

export default Login;