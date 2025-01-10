import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      {/* Left Section: Home */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          LitLore
        </Link>
      </div>

      {/* Right Section: User Info & Actions */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Welcome, {user.username}</span>
            <Link to="/profile" className="navbar-button">
              Profile
            </Link>
            <button className="navbar-button" onClick={onLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">
              Login
            </Link>
            <Link to="/signup" className="navbar-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;