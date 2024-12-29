import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Home
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Welcome, {user.username}</span>
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