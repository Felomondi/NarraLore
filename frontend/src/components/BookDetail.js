import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { doc, getDoc, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./BookDetail.css";
import ReviewSection from "./ReviewSection"; // Import the ReviewSection component

const cleanText = (text) => {
  const parser = new DOMParser();
  const decodedText =
    parser.parseFromString(text, "text/html").body.textContent || "";
  return decodedText.replace(/<[^>]*>/g, "");
};

const BookDetail = () => {
  const { id: bookID } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/books/${bookID}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookID]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("You need to log in to submit a review.");
      return;
    }

    try {
      // Fetch the user's username from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User not found. Please try again.");
        return;
      }

      const { username } = userSnap.data();

      // Add the review to the "reviews" subcollection under the book's document
      const reviewRef = collection(db, "books", bookID, "reviews");
      const newReview = {
        userID: user.uid,
        username: username || "Anonymous",
        rating: Number(rating),
        review,
        createdAt: new Date(),
      };

      await addDoc(reviewRef, newReview);

      // Add the review to the user's "reviews" array
      await updateDoc(userRef, {
        reviews: arrayUnion({
          bookID,
          reviewID: newReview.reviewID || `${Date.now()}`,
          rating: newReview.rating,
          review: newReview.review,
          createdAt: newReview.createdAt,
        }),
      });

      alert("Your review has been submitted successfully!");
      setShowModal(false); // Close the modal
      setRating(""); // Reset the rating
      setReview(""); // Reset the review
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit your review. Please try again.");
    }
  };

  // Manage scrolling behavior when the modal is active
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error fetching book details: {error}</p>;
  if (!book) return <p>Book not found. Please go back to the homepage.</p>;

  const description = book.volumeInfo.description;

  return (
    <div className={`book-detail-page ${showModal ? "modal-active" : ""}`}>
      <div className="book-detail-container">
        <div className="book-detail-left">
          <img
            src={
              book.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/150"
            }
            alt={book.volumeInfo.title}
            className="book-detail-image"
          />
          <p><strong>Authors:</strong> {book.volumeInfo.authors?.join(", ") || "Unknown"}</p>
          <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate || "Not available"}</p>
          <p><strong>Page Count:</strong> {book.volumeInfo.pageCount || "Not available"} pages</p>
          <p><strong>Publisher:</strong> {book.volumeInfo.publisher || "Not available"}</p>
          <p><strong>Language:</strong> {book.volumeInfo.language?.toUpperCase() || "Not available"}</p>
        </div>
        <div className="book-detail-right">
          <div>
            <h3>Description:</h3>
            {description ? (
              <p>{cleanText(description)}</p>
            ) : (
              <p>No description available.</p>
            )}
          </div>
          <p><strong>Categories:</strong> {book.volumeInfo.categories?.join(", ") || "Not available"}</p>
          <p><strong>Average Rating:</strong> {book.volumeInfo.averageRating || "Not rated yet"} (out of 5)</p>
          <p><strong>Ratings Count:</strong> {book.volumeInfo.ratingsCount || "No ratings yet"}</p>
          <p><strong>ISBN:</strong> {book.volumeInfo.industryIdentifiers?.map((id) => id.identifier).join(", ") || "Not available"}</p>
          {book.saleInfo?.buyLink && (
            <p>
              <strong>Buy:</strong>{" "}
              <a href={book.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
                Purchase here
              </a>
            </p>
          )}
          <button className="add-review-button" onClick={() => setShowModal(true)}>
            Add a Review
          </button>
        </div>
      </div>

{/* Modal Popup */}
{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Add Your Review</h3>
      <form onSubmit={handleReviewSubmit}>
        <label>
          Rating (1 to 5):
          <input
            type="number"
            min="1"
            max="5"
            step="0.1" // Allow decimals
            value={rating}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // Parse input as a float
              if (value >= 1 && value <= 5) {
                setRating(value);
              } else {
                alert("Rating must be between 1 and 5.");
              }
            }}
            required
          />
        </label>
        <label>
          Review:
          <textarea
            rows="4"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <div className="modal-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Review Section */}
      <ReviewSection bookID={bookID} />
    </div>
  );
};

export default BookDetail;