import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./ReviewSection.css";
import CommentSection from "./CommentSection.js";

const ReviewSection = ({ bookID }) => {
  const [reviews, setReviews] = useState([]);
  const currentUser = auth.currentUser;
  const [openComments, setOpenComments] = useState({}); // Track which comments are open


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
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        likes: doc.data().likes || [] // Default to empty array
      }));
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [bookID]);

  const toggleComments = (reviewId) => {
    setOpenComments((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  // Handle Like/Unlike Review
  const handleLike = async (reviewId, likes) => {
    if (!currentUser) {
      alert("You must be logged in to like a review.");
      return;
    }

    const reviewRef = doc(db, "reviews", reviewId);
    const isLiked = likes.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(reviewRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(reviewRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      alert("Failed to like/unlike. Try again.");
    }
  };

  

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

              {/* Like Button (Only if the review does NOT belong to the current user) */}
              {currentUser && review.userId !== currentUser.uid && (
                <button 
                  className={`like-button ${review.likes.includes(currentUser.uid) ? "liked" : ""}`} 
                  onClick={() => handleLike(review.id, review.likes)}
                >
                  ❤️ {review.likes.length}
                </button>
              )}
            </div>
            
            <p className="review-content">{review.content}</p>

            {/* Comments Button */}
             <button className="comment-toggle-button" onClick={() => toggleComments(review.id)} >
              {openComments[review.id] ? "Hide Comments" : "View/Add Comments"}
            </button>

            {/* Show Comments when toggled */}
            {openComments[review.id] && <CommentSection reviewId={review.id} />}
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