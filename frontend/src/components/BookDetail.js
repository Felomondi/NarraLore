import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetail.css";

// Utility function to clean text
const cleanText = (text) => {
  // Decode HTML entities and remove HTML tags
  const parser = new DOMParser();
  const decodedText = parser.parseFromString(text, "text/html").body.textContent || "";
  return decodedText.replace(/<[^>]*>/g, ""); // Remove remaining HTML tags
};

const BookDetail = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/books/${id}`);
        setBook(response.data); // Set the book data from the API response
        setLoading(false); // Turn off the loading indicator
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (error) {
    return <p>Error fetching book details: {error}</p>;
  }

  if (!book) {
    return <p>Book not found. Please go back to the homepage.</p>;
  }

  const description = book.volumeInfo.description;

  return (
    <div className="book-detail">
      <h2>{book.volumeInfo.title}</h2>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
        alt={book.volumeInfo.title}
        className="book-detail-image"
      />
      <p><strong>Authors:</strong> {book.volumeInfo.authors?.join(", ") || "Unknown"}</p>
      <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate || "Not available"}</p>
      <p><strong>Publisher:</strong> {book.volumeInfo.publisher || "Not available"}</p>
      <p><strong>Page Count:</strong> {book.volumeInfo.pageCount || "Not available"} pages</p>
      <p><strong>Categories:</strong> {book.volumeInfo.categories?.join(", ") || "Not available"}</p>
      <p><strong>Language:</strong> {book.volumeInfo.language?.toUpperCase() || "Not available"}</p>
      <p><strong>Average Rating:</strong> {book.volumeInfo.averageRating || "Not rated yet"} (out of 5)</p>
      <p><strong>Ratings Count:</strong> {book.volumeInfo.ratingsCount || "No ratings yet"}</p>
      <p><strong>ISBN:</strong> {book.volumeInfo.industryIdentifiers?.map((id) => id.identifier).join(", ") || "Not available"}</p>
      <div>
        <h3>Description:</h3>
        {description ? (
          <p>{cleanText(description)}</p>
        ) : (
          <p>No description available.</p>
        )}
      </div>
      {/* <p>
        <strong>Preview:</strong>{" "}
        <a href={book.volumeInfo.previewLink} target="_blank" rel="noopener noreferrer">
          Click here
        </a>
      </p> */}
      {book.saleInfo?.buyLink && (
        <p>
          <strong>Buy:</strong>{" "}
          <a href={book.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
            Purchase here
          </a>
        </p>
      )}

      <form className="review-form">
        <h3>Have you read this book? Submit a Review!</h3>
        <label>
          Rating:
          <input type="number" min="1" max="5" />
        </label>
        <label>
          Review:
          <textarea rows="4" />
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default BookDetail;