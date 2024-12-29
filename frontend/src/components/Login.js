import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Add a CSS file for styling

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", { email, password });
      console.log("Login successful:", res.data); // Debug success response
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user); // Save user data
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Error response:", error.response); // Debug error response
      alert(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="login-footer">
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </form>
    </div>
  );
};

export default Login;