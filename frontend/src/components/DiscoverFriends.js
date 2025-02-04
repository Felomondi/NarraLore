import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./DiscoverFriends.css";
import profilePic from "../assets/pic.jpg";

const DiscoverFriends = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [followingList, setFollowingList] = useState([]); // List of users the current user is following

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No logged-in user found.");
          return;
        }

        // Fetch current user's following list
        const currentUserRef = doc(db, "users", currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        if (currentUserSnap.exists()) {
          setFollowingList(currentUserSnap.data().following || []);
        }

        // Fetch all users from the 'users' collection
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const userList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.userID !== currentUser.uid); // Exclude the logged-in user

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (targetUserId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to follow users.");
      return;
    }
  
    try {
      const currentUserRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", targetUserId);
  
      const isAlreadyFollowing = followingList.includes(targetUserId);
  
      if (isAlreadyFollowing) {
        // Unfollow user
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUserId),
        });
  
        // Only update "followers" field in the target user document
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid),
        });
  
        setFollowingList((prev) => prev.filter((id) => id !== targetUserId));
      } else {
        // Follow user
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUserId),
        });
  
        // Only update "followers" field in the target user document
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid),
        });
  
        setFollowingList((prev) => [...prev, targetUserId]);
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
      alert("Failed to follow user. Please try again.");
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="discover-container">
      <h2>Discover Friends</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Loading State */}
      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user-card">
              <img
                src={profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="user-avatar"
              />
              <div className="user-info">
                <p className="username">{user.username}</p>
                <button
                  className={`follow-button ${
                    followingList.includes(user.userID) ? "following" : ""
                  }`}
                  onClick={() => handleFollow(user.userID)}
                >
                  {followingList.includes(user.userID) ? "Unfollow" : "Follow"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default DiscoverFriends;