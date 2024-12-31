import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Store profile data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        // Fetch profile data
        const response = await axios.get("http://127.0.0.1:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data.user); // Update profile state with user data
        setLoading(false); // Turn off loading indicator
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Render loading state
  if (loading) {
    return <p>Loading profile...</p>;
  }

  // Render error state
  if (error) {
    return <p>{error}</p>;
  }

  // Render profile details
  return (
    <div className="profile-container">
      <h2>Hi, {profile.username}!</h2>
      <div className="profile-picture">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile Placeholder"
        />
      </div>
      <div className="profile-details">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>User ID:</strong> {profile.id}</p>
      </div>
    </div>
  );
};

export default Profile;