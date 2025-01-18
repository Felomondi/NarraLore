import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; // Import the logo

const Navbar = ({ user, toggleSidebar, isSmallScreen }) => {
  return (
    <nav className="navbar">
      {/* Left Section: Sidebar Toggle */}
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> {/* FontAwesome for the menu icon */}
        </button>
        {isSmallScreen && (
          <img src={logo} alt="Logo" className="navbar-logo" /> // Display logo on smaller screens
        )}
      </div>

      {/* Right Section: User Info */}
      <div className="navbar-right">
        {user ? (
          <span className="navbar-user">Welcome, {user.username}</span>
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