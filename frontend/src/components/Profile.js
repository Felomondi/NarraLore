import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Profile.css";
import UserReviews from "./UserReviews";
import profilePic from "../assets/pic.jpg";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");

  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;
  const placeholderImage = "https://via.placeholder.com/150";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData({
              ...data,
              profilePic: data.profilePic || placeholderImage,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditUsername = async () => {
    if (!newUsername.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    try {
      if (userId) {
        const userRef = doc(db, "users", userId);

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
        <img src={profilePic} alt="Profile" className="profile-pic" />
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
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      {/* User Reviews Section */}
      <div className="user-reviews-section">
        <UserReviews />
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