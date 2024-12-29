import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchReviews = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      };
      fetchReviews();
    }
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <h3>Your Reviews:</h3>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <strong>Book ID:</strong> {review.book_id}
            <br />
            <strong>Rating:</strong> {review.rating}
            <br />
            <strong>Review:</strong> {review.review_text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;