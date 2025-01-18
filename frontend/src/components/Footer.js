import React from "react";
import "./Footer.css";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo */}
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="footer-logo-image" />
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>

      {/* Horizontal Line */}
      <hr />

      {/* Social Icons and Copyright */}
      <div className="footer-bottom">
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <p>&copy; 2025 BookCritique. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;