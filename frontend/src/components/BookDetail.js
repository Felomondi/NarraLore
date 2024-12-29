import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetail.css";

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

  return (
    <div className="book-detail">
      <h2>{book.volumeInfo.title}</h2>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
        alt={book.volumeInfo.title}
        className="book-detail-image"
      />
      <p><strong>Authors:</strong> {book.volumeInfo.authors?.join(", ")}</p>
      <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate}</p>
      <p><strong>Description:</strong> {book.volumeInfo.description}</p>

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