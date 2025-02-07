import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Query books the user has reviewed
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(reviewsQuery);

        // Extract book details
        const bookmarkedBooks = querySnapshot.docs.map((doc) => ({
          id: doc.data().bookId,
          title: doc.data().bookTitle,
          author: doc.data().bookAuthor || "Unknown",
          thumbnail: doc.data().bookThumbnail || "https://via.placeholder.com/150",
        }));

        setBookmarks(bookmarkedBooks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bookmarks-container">
      <h2>Your Bookmarked Books</h2>

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length > 0 ? (
        <div className="bookmarks-grid">
          {bookmarks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="bookmark-card">
              <img src={book.thumbnail} alt={book.title} className="bookmark-image" />
              <div className="bookmark-card-content">
                <p className="bookmark-author">{book.author}</p>
                <h3 className="bookmark-title">{book.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-bookmarks">No bookmarks yet. Start reviewing books to add them here!</p>
      )}
    </div>
  );
};

export default Bookmarks;