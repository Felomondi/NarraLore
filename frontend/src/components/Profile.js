import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Profile.css";
import UserReviews from "./UserReviews";
import profilePic from "../assets/pic.jpg";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  // Separate states for raw IDs and details
  const [rawFollowingList, setRawFollowingList] = useState([]);
  const [rawFollowersList, setRawFollowersList] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [followersDetails, setFollowersDetails] = useState([]);
  const [isFollowingPopupOpen, setIsFollowingPopupOpen] = useState(false);
  const [isFollowersPopupOpen, setIsFollowersPopupOpen] = useState(false);

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
            // Save raw IDs
            setRawFollowingList(data.following || []);
            setRawFollowersList(data.followers || []);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  // This function still expects an array of IDs (strings)
  const fetchUserDetails = async (userIDs) => {
    try {
      const usersDetails = await Promise.all(
        userIDs.map(async (id) => {
          const userRef = doc(db, "users", id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const { username } = userSnap.data();
            return { id, username };
          }
          return { id, username: "Unknown User" };
        })
      );
      return usersDetails;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return [];
    }
  };

  const openFollowingPopup = async () => {
    // Fetch details from rawFollowingList
    const details = await fetchUserDetails(rawFollowingList);
    setFollowingDetails(details);
    setIsFollowingPopupOpen(true);
  };

  const openFollowersPopup = async () => {
    // Fetch details from rawFollowersList
    const details = await fetchUserDetails(rawFollowersList);
    setFollowersDetails(details);
    setIsFollowersPopupOpen(true);
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
          {currentUser && currentUser.uid === userId && (
            <button className="edit-icon" onClick={() => setIsEditing(true)} title="Edit Username">
              ✏️
            </button>
          )}
        </p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      {/* Followers & Following Stats */}
      <div className="follow-section">
        <button onClick={openFollowersPopup}>
          Followers: {rawFollowersList.length}
        </button>
        <button onClick={openFollowingPopup}>
          Following: {rawFollowingList.length}
        </button>
      </div>

      {/* User Reviews Section */}
      <div className="user-reviews-section">
        <UserReviews />
      </div>

      {/* Followers List Popup */}
      {isFollowersPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Followers</h3>
            {followersDetails.length > 0 ? (
              followersDetails.map((follower) => (
                <div key={follower.id} className="follow-item">
                  <img src={profilePic} alt="User" className="follow-pic" />
                  <p>{follower.username}</p>
                </div>
              ))
            ) : (
              <p>No followers yet.</p>
            )}
            <button onClick={() => setIsFollowersPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Following List Popup */}
      {isFollowingPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Following</h3>
            {followingDetails.length > 0 ? (
              followingDetails.map((following) => (
                <div key={following.id} className="follow-item">
                  <img src={profilePic} alt="User" className="follow-pic" />
                  <p>{following.username}</p>
                </div>
              ))
            ) : (
              <p>Not following anyone yet.</p>
            )}
            <button onClick={() => setIsFollowingPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

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
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;