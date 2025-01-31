import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebase"; // Firebase setup
import "./Profile.css";
import UserReviews from "./UserReviews"; // Import the UserReviews component
import profilePic from "./pic.jpg";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [isFollowingPopupOpen, setIsFollowingPopupOpen] = useState(false);
  const [isFollowersPopupOpen, setIsFollowersPopupOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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
            setFollowingList(data.following || []);
            setFollowersList(data.followers || []);

            if (currentUser && data.followers?.includes(currentUser.uid)) {
              setIsFollowing(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      alert("You must be logged in to follow users.");
      return;
    }

    try {
      const currentUserRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", userId);

      if (isFollowing) {
        await updateDoc(currentUserRef, { following: arrayRemove(userId) });
        await updateDoc(targetUserRef, { followers: arrayRemove(currentUser.uid) });

        setIsFollowing(false);
        setFollowersList((prev) => prev.filter((id) => id !== currentUser.uid));
      } else {
        await updateDoc(currentUserRef, { following: arrayUnion(userId) });
        await updateDoc(targetUserRef, { followers: arrayUnion(currentUser.uid) });

        setIsFollowing(true);
        setFollowersList((prev) => [...prev, currentUser.uid]);
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
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
          {currentUser && currentUser.uid === userId && (
            <button className="edit-icon" onClick={() => setIsEditing(true)} title="Edit Username">
              ✏️
            </button>
          )}
        </p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      {/* Follow button (only visible on other profiles) */}
      {currentUser && currentUser.uid !== userId && (
        <button className="follow-button" onClick={handleFollow}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {/* Followers & Following Stats */}
      <div className="follow-section">
        <button onClick={() => setIsFollowersPopupOpen(true)}>Followers: {followersList.length}</button>
        <button onClick={() => setIsFollowingPopupOpen(true)}>Following: {followingList.length}</button>
      </div>

      {/* User Reviews Section */}
      <div className="user-reviews-section">
        <UserReviews /> {/* Display the user's reviews */}
      </div>

      {/* Followers List Popup */}
      {isFollowersPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Followers</h3>
            {followersList.length > 0 ? (
              followersList.map((follower, index) => (
                <div key={index} className="follow-item">
                  <img src={placeholderImage} alt="User" className="follow-pic" />
                  <p>{follower}</p>
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
            {followingList.length > 0 ? (
              followingList.map((following, index) => (
                <div key={index} className="follow-item">
                  <img src={placeholderImage} alt="User" className="follow-pic" />
                  <p>{following}</p>
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
            <input type="text" placeholder="Enter new username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
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