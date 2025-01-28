import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { bookService } from '../services/api';
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./BookDetail.css";
import ReviewSection from "./ReviewSection";

const cleanText = (text) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html").body.textContent || "";
};

const BookDetail = () => {
  const { id: bookID } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState("");
  const [reviewContent, setReviewContent] = useState("");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await bookService.getBookDetails(bookID);
        setBook(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchBookDetails();
  }, [bookID]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
  
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (!userDoc.exists()) {
        console.log("No user doc found for this UID!");
      } else {
        console.log("userDoc data:", userDoc.data());
      }
      
      // Get display name from Firestore or fallback to auth or Anonymous
      const displayName = userData?.username ||
                          user.email?.split('@')[0] ||
                          "Anonymous";

      // IMPORTANT: Include the book's title in the review doc
      const volumeInfo = book?.volumeInfo || {};
      const currentBookTitle = volumeInfo.title || "Untitled";

      await addDoc(collection(db, "reviews"), {
        bookId: bookID,
        bookTitle: currentBookTitle, // <--- storing the title
        userId: user.uid,
        userDisplayName: displayName,
        rating: Number(rating),
        content: reviewContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
  
      setShowModal(false);
      setRating("");
      setReviewContent("");
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Review submission failed:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showModal]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>Book not found.</p>;

  const { volumeInfo } = book;

  return (
    <div className={`book-detail-page ${showModal ? "modal-active" : ""}`}>
      <div className="book-detail-container">
        <div className="book-detail-left">
          <img
            src={volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
            alt={volumeInfo.title}
            className="book-detail-image"
          />
          <p><strong>Authors:</strong> {volumeInfo.authors?.join(", ") || "Unknown"}</p>
          <p><strong>Published:</strong> {volumeInfo.publishedDate || "N/A"}</p>
          <p><strong>Pages:</strong> {volumeInfo.pageCount || "N/A"}</p>
          <p><strong>Publisher:</strong> {volumeInfo.publisher || "N/A"}</p>
          <p><strong>Language:</strong> {volumeInfo.language?.toUpperCase() || "N/A"}</p>
        </div>

        <div className="book-detail-right">
          <div>
            <h3>Description:</h3>
            {volumeInfo.description ? (
              <p>{cleanText(volumeInfo.description)}</p>
            ) : <p>No description available.</p>}
          </div>
          
          <div className="book-metadata">
            <p><strong>Categories:</strong> {volumeInfo.categories?.join(", ") || "N/A"}</p>
            <p><strong>Average Rating:</strong> {volumeInfo.averageRating || "N/A"}/5</p>
            <p><strong>Ratings Count:</strong> {volumeInfo.ratingsCount || "0"}</p>
            <p><strong>ISBN:</strong> {volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A"}</p>
          </div>

          {volumeInfo.saleInfo?.buyLink && (
            <a
              href={volumeInfo.saleInfo.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="buy-link"
            >
              Purchase Book
            </a>
          )}

          <button className="add-review-button" onClick={() => setShowModal(true)}>
            Add Review
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Write Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={rating}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setRating(value >= 1 && value <= 5 ? value : "");
                  }}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Review:</label>
                <textarea
                  rows="4"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReviewSection bookID={bookID} />
    </div>
  );
};

export default BookDetail;