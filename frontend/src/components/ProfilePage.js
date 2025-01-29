import React from "react";
import Profile from "./Profile";
import UserReviews from "./UserReviews";

const ProfilePage = () => {
  return (
    <div className="profile-page-container">
      <Profile />
      <UserReviews />
    </div>
  );
};

export default ProfilePage;