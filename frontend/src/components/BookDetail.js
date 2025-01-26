import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetail.css";

const cleanText = (text) => {
  const parser = new DOMParser();
  const decodedText =
    parser.parseFromString(text, "text/html").body.textContent || "";
  return decodedText.replace(/<[^>]*>/g, "");
};

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(""); // Number rating state
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted review:", { rating, review });
    setShowModal(false);
    setRating(""); // Clear rating
    setReview(""); // Clear review
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error fetching book details: {error}</p>;
  if (!book) return <p>Book not found. Please go back to the homepage.</p>;

  const description = book.volumeInfo.description;

  return (
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
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
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
    </div>
  );
};

export default BookDetail;