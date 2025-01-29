import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./ReviewSection.css"; // Reuse the same styling

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
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
  }, [user]);

  if (!user) return <p>Please log in to view your reviews.</p>;

  return (
    <div className="user-reviews-container">
      <h3>Your Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              {/* Show Book Title (fallback to bookId if no title stored) */}
              <span className="review-book">
                Book Title: {review.bookTitle || review.bookId}
              </span>

              {/* Star Rating */}
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
        <p className="no-reviews">You haven't submitted any reviews yet.</p>
      )}
    </div>
  );
};

export default UserReviews;