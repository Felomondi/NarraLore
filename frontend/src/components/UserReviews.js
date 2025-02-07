import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./UserReviews.css";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newRating, setNewRating] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEdit = (review) => {
    setEditReview(review);
    setNewContent(review.content);
    setNewRating(review.rating);
  };

  const handleUpdateReview = async () => {
    if (!editReview) return;

    try {
      const reviewRef = doc(db, "reviews", editReview.id);
      await updateDoc(reviewRef, {
        content: newContent,
        rating: Number(newRating),
        updatedAt: new Date(),
      });

      setEditReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  if (!user) return <p>Please log in to view your reviews.</p>;

  return (
    <div className="user-reviews-container">
      <h3>Your Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="review-book">Book: {review.bookTitle}</span>
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
              <span className="review-date">{review.createdAt.toLocaleDateString()}</span>

              {/* Edit & Delete Icons */}
              <div className="review-actions">
                <button className="edit-icon" onClick={() => handleEdit(review)}>📝</button>
                <button className="delete-icon" onClick={() => handleDelete(review.id)}>🗑️</button>
              </div>
            </div>
            <p className="review-content">{review.content}</p>
          </div>
        ))
      ) : (
        <p className="no-reviews">You haven't submitted any reviews yet.</p>
      )}

      {/* Edit Review Popup */}
      {editReview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Review</h3>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              required
            />
            <textarea
              rows="4"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button onClick={handleUpdateReview}>Update</button>
              <button onClick={() => setEditReview(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews;