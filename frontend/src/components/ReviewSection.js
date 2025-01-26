import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./ReviewSection.css";

const ReviewSection = ({ bookID }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "books", bookID, "reviews");
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [bookID]);

  return (
    <div className="review-section-container">
      <h3>Reviews/Comments</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <p className="username">{review.username}</p>
            <p className="rating">
              {"⭐".repeat(review.rating)} ({review.rating})
            </p>
            <p>{review.review}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to add one!</p>
      )}
    </div>
  );
};

export default ReviewSection;