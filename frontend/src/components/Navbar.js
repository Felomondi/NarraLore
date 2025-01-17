import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user }) => {
  return (
    <nav className="navbar">
      {/* Left Section: Logo or Title */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          LitLore
        </Link>
      </div>

      {/* Right Section: Buttons */}
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