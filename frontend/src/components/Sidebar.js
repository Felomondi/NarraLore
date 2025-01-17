import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "./logo.png";

const Sidebar = ({ user, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="sidebar-logo-image" />
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">
          <i className="fas fa-home sidebar-icon"></i>
          Home
        </Link>
        <Link to="/bookmarks" className="sidebar-link">
          <i className="fas fa-bookmark sidebar-icon"></i>
          Bookmarks
        </Link>
        <Link to="/settings" className="sidebar-link">
          <i className="fas fa-cog sidebar-icon"></i>
          Settings
        </Link>
        {user && (
          <>
            <Link to="/profile" className="sidebar-link">
              <i className="fas fa-user sidebar-icon"></i>
              Profile
            </Link>
            <button className="sidebar-link logout-button" onClick={onLogout}>
              <i className="fas fa-sign-out-alt sidebar-icon"></i>
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;