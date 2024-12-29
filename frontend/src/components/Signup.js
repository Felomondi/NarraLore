import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Add a CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", { username, email, password });
      alert("Signup successful! You can now log in.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error response:", error.response); // Log error for debugging
      alert(error.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Sign Up</h2>
        <input
          type="text"
          className="signup-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p className="signup-footer">
          Already have an account? <a href="/login">Log in here</a>.
        </p>
      </form>
    </div>
  );
};

export default Signup;