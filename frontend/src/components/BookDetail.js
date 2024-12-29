import React, { useState } from 'react';
import axios from 'axios';

const BookDetail = ({ book }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/reviews',
      { book_id: book.id, rating, review_text: reviewText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Review submitted successfully!');
  };

  return (
    <div>
      <h2>{book.volumeInfo.title}</h2>
      <p>{book.volumeInfo.description}</p>
      <form onSubmit={handleReviewSubmit}>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>
        <br />
        <label>
          Review:
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default BookDetail;