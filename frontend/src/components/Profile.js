import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Firebase setup
import "./Profile.css";
import profilePic from "./profilepic.jpg";

const Profile = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [isEditing, setIsEditing] = useState(false); // Show/hide edit popup
  const [newUsername, setNewUsername] = useState(""); // Store new username
  const [error, setError] = useState(""); // Handle errors

  const placeholderImage = "https://via.placeholder.com/150"; // Placeholder profile image URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData({
              ...data,
              profilePic: data.profilePic || placeholderImage, // Use placeholder if no profilePic exists
            });
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditUsername = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);

        // Update the username in Firestore
        await updateDoc(userRef, { username: newUsername });

        // Update local state
        setUserData((prev) => ({ ...prev, username: newUsername }));
        setIsEditing(false); // Close the popup
        setNewUsername(""); // Reset input
        setError(""); // Clear errors
      }
    } catch (err) {
      console.error("Error updating username:", err);
      setError("Failed to update username. Please try again.");
    }
  };

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
        <h2>Hi, {userData.username}</h2>
      <div className="profile-pic-section">
        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
        />
        </div>
      <div className="profile-details">
        <p>
          <strong>Username:</strong> {userData.username}
          <button
            className="edit-icon"
            onClick={() => setIsEditing(true)}
            title="Edit Username"
          >
            ✏️
          </button>
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
      </div>

      {/* Popup for Editing Username */}
      {isEditing && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h3>Edit Username</h3>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <div className="edit-popup-buttons">
              <button onClick={handleEditUsername}>Submit</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;