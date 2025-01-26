import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import axios from "axios"; // Import axios for API calls
import "./UserReviews.css";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [bookTitles, setBookTitles] = useState({}); // Cache for book titles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserReviews = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError("You need to log in to view your reviews.");
        setLoading(false);
        return;
      }

      try {
        // Fetch the user's document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setReviews(userData.reviews || []); // Set the reviews array (or empty array if none exist)
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  // Fetch book titles based on book IDs
  useEffect(() => {
    const fetchBookTitles = async () => {
      const titleCache = { ...bookTitles }; // Copy the current cache
      const requests = reviews
        .filter((review) => !titleCache[review.bookID]) // Only fetch titles for IDs not in the cache
        .map(async (review) => {
          try {
            const response = await axios.get(`http://127.0.0.1:5000/api/books/${review.bookID}`);
            titleCache[review.bookID] = response.data.volumeInfo.title; // Cache the title
          } catch (err) {
            console.error(`Error fetching title for bookID ${review.bookID}:`, err);
          }
        });

      await Promise.all(requests); // Wait for all requests to complete
      setBookTitles(titleCache); // Update the state with the new titles
    };

    if (reviews.length > 0) {
      fetchBookTitles();
    }
  }, [reviews, bookTitles]);

  if (loading) return <p>Loading your reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-reviews-container">
      <h3>Your Reviews</h3>
      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <h4>
                {bookTitles[review.bookID] || "Loading..."} {/* Show title or fallback */}
              </h4>
              <p className="rating">
                {"⭐".repeat(review.rating)} ({review.rating})
              </p>
              <p className="review-text">{review.review}</p>
              <small className="review-date">
                Reviewed on: {new Date(review.createdAt.seconds * 1000).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven’t written any reviews yet.</p>
      )}
    </div>
  );
};

export default UserReviews;