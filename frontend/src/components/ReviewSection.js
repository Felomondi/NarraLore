import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./ReviewSection.css";

const ReviewSection = ({ bookID }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("bookId", "==", bookID),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [bookID]);

  return (
    <div className="review-section-container">
      <h3>Reader Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="review-author">
                {review.userDisplayName || "Anonymous"}
              </span>

              {/* Rating: full stars + optional half-star */}
              <span className="review-rating">
                {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                  <span key={i} className="star-icon">⭐</span>
                ))}
                {review.rating % 1 !== 0 && (
                  <span className="star-icon half-star">
                    <i className="fas fa-star-half-alt"></i>
                  </span>
                )}
              </span>

              <span className="review-date">
                {review.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="review-content">{review.content}</p>
          </div>
        ))
      ) : (
        <p className="no-reviews">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default ReviewSection;