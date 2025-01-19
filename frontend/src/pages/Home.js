import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const categories = [
  { title: "Romance", query: "romance" },
];

const Home = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const selfHelpGridRef = useRef(null);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const promises = categories.map((category) =>
          axios.get(
            `http://127.0.0.1:5000/api/books?query=${category.query}&maxResults=10`
          )
        );

        const responses = await Promise.all(promises);

        const booksData = responses.reduce((acc, response, index) => {
          acc[categories[index].title] = response.data || [];
          return acc;
        }, {});

        setBooksByCategory(booksData);
      } catch (error) {
        console.error("Error fetching books by category:", error);
      }
    };

    const fetchSelfHelpBooks = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/books?query=self_help&maxResults=10`
        );
        setSelfHelpBooks(response.data || []);
      } catch (error) {
        console.error("Error fetching Self-Help books:", error);
      }
    };

    fetchBooksByCategory();
    fetchSelfHelpBooks();
  }, []);

  const scrollHorizontally = (direction) => {
    if (selfHelpGridRef.current) {
      const scrollAmount = 300; // Adjust scroll distance
      selfHelpGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="homepage-container">
      {/* Tablet Mockup Section */}
      <div className="tablet-mockup">
        <div className="tablet-screen">
          <div className="mockup-header">
            <h1>Hi, Welcome to LitLore.</h1>
            <h2>Unlock the World of Reading with LitLore!</h2>
            <p>
              <span className="benefit">📚 Access a vast collection of free books.</span>
              <span className="benefit">🎧 Enjoy hands-free reading with our TTS models.</span>
              <span className="benefit">🚀 Boost your productivity effortlessly.</span>
            </p>
            <button className="cta-button">Start Reading</button>
          </div>
        </div>
      </div>

      <div className="self-help-section">
        <div className="self-help-header">
          <h2>
            <i className="fas fa-leaf icon"></i> Recommended Self-Help Books
          </h2>
        </div>

        {/* Scroll Buttons Inside the Self-Help Section */}
        <div className="scroll-buttons-container">
          <button
            className="scroll-button left"
            onClick={() => scrollHorizontally("left")}
          >
            &#8249; {/* Left Arrow */}
          </button>
          <button
            className="scroll-button right"
            onClick={() => scrollHorizontally("right")}
          >
            &#8250; {/* Right Arrow */}
          </button>
        </div>

        {/* Self-Help Books Grid */}
        <div className="self-help-grid" ref={selfHelpGridRef}>
          {selfHelpBooks.length > 0 ? (
            selfHelpBooks.map((book) => (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                className="self-help-card"
              >
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={book.volumeInfo.title}
                />
                <div className="self-help-card-content">
                <p>{book.volumeInfo.authors?.join(", ")}</p>
                  <h3>{book.volumeInfo.title}</h3>
                  
                  <div className="self-help-rating">
                    <span>⭐ {book.volumeInfo.averageRating || "No Ratings"}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No Self-Help books available</p>
          )}
        </div>
      </div>

      {/* Other Categories */}
      {categories.map((category) => (
        <div key={category.title} className="category-section">
          <h2>{category.title}</h2>
          <div className="books-grid">
            {booksByCategory[category.title]?.length > 0 ? (
              booksByCategory[category.title].map((book) => (
                <Link
                  to={`/book/${book.id}`}
                  key={book.id}
                  className="book-card"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/150"
                    }
                    alt={book.volumeInfo.title}
                  />
                </Link>
              ))
            ) : (
              <p>No books available in this category</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;