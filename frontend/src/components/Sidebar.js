import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen, isSmallScreen, user, onLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {!isSmallScreen && (
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="sidebar-logo-image" />
        </div>
      )}
      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">
          <i className="fas fa-home sidebar-icon"></i>
          Home
        </Link>
        {user && (
          <>
              <Link to="/bookmarks" className="sidebar-link">
                <i className="fas fa-bookmark sidebar-icon"></i>
                Bookmarks
              </Link>
            <Link to="/discover-friends" className="sidebar-link">
              <i className="fas fa-users sidebar-icon"></i>
              Discover Friends
            </Link>
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