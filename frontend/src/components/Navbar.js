import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase"; // Ensure auth and db are correctly imported
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Navbar.css";
import logo from "../assets/logo.png"; // Import the logo

const Navbar = ({ toggleSidebar, isSmallScreen }) => {
  const [user, setUser] = useState(null); // Track user authentication state
  const [username, setUsername] = useState(""); // Store the user's username

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user

        try {
          // Fetch the user's username from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username || ""); // Set username or default to an empty string
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      } else {
        setUser(null); // Clear user state on logout
        setUsername(""); // Clear username
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  return (
    <nav className="navbar">
      {/* Left Section: Sidebar Toggle */}
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> {/* FontAwesome for the menu icon */}
        </button>
        {isSmallScreen && <img src={logo} alt="Logo" className="navbar-logo" />}
      </div>

      {/* Right Section: User Info */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Welcome, {username || "User"}!</span>
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