import React, { useEffect, useState, useRef } from "react";
import { bookService } from '../services/api';
import { Link } from "react-router-dom";
import "./Home.css";

const categories = [{ title: "Romance", query: "romance" }];

const curatedCategories = [
  "Motivation",
  "Poem",
  "Biography",
  "Novel",
  "Fiction",
  "Non-Fiction",
  "Literature",
  "Romance",
  "Career",
  "Lifestyle",
  "Psychology",
  "Culture",
  "Gym",
  "Self Development",
  "Technology",
  "Finance",
  "Short Story",
  "Life",
  "Cons",
];

const Home = () => {
  const [/*booksByCategory*/, setBooksByCategory] = useState({});
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [curatedBooks, setCuratedBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const selfHelpGridRef = useRef(null);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const promises = categories.map((category) =>
          bookService.getBooks(category.query, 10)
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
        const response = await bookService.getBooks('self_help', 10);
        setSelfHelpBooks(response.data || []);
      } catch (error) {
        console.error("Error fetching Self-Help books:", error);
      }
    };

    const fetchDefaultCuratedCategory = async () => {
      const defaultCategory = curatedCategories[0];
      setSelectedCategory(defaultCategory);
      setLoading(true);
      setIsSearchActive(false);

      try {
        const response = await bookService.getBooks(defaultCategory, 10);
        setCuratedBooks(response.data || []);
      } catch (error) {
        console.error("Error fetching default curated books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory();
    fetchSelfHelpBooks();
    fetchDefaultCuratedCategory();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCuratedBooks([]);
    setLoading(true);
    setIsSearchActive(false);

    try {
      const response = await bookService.getBooks(category, 10);
      setCuratedBooks(response.data || []);
    } catch (error) {
      console.error("Error fetching curated books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    setLoading(true);
    setIsSearchActive(true);

    try {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await bookService.getBooks(encodedSearchQuery, 10);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollHorizontally = (direction) => {
    if (selfHelpGridRef.current) {
      const scrollAmount = 300;
      selfHelpGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="homepage-container">
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

        <div className="scroll-buttons-container">
          <button
            className="scroll-button left"
            onClick={() => scrollHorizontally("left")}
          >
            &#8249;
          </button>
          <button
            className="scroll-button right"
            onClick={() => scrollHorizontally("right")}
          >
            &#8250;
          </button>
        </div>

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

      <div className="curated-section">
        <div className="curated-header">
          <h2>
            <i className="fas fa-book"></i> Curated Book Collection
          </h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Browse by book title, author"
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="curated-categories">
          {curatedCategories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="curated-grid">
          {loading ? (
            <p>Loading books...</p>
          ) : isSearchActive ? (
            searchResults.length > 0 ? (
              searchResults.map((book) => (
                <Link
                  to={`/book/${book.id}`}
                  key={book.id}
                  className="curated-card"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/150"
                    }
                    alt={book.volumeInfo.title}
                  />
                  <div className="curated-card-content">
                    <p>{book.volumeInfo.authors?.join(", ")}</p>
                    <h3>{book.volumeInfo.title}</h3>
                    <div className="curated-card-info">
                      <span>⭐ {book.volumeInfo.averageRating || "No Ratings"}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No books found.</p>
            )
          ) : curatedBooks.length > 0 ? (
            curatedBooks.map((book) => (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                className="curated-card"
              >
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={book.volumeInfo.title}
                />
                <div className="curated-card-content">
                  <p>{book.volumeInfo.authors?.join(", ")}</p>
                  <h3>{book.volumeInfo.title}</h3>
                  <div className="curated-card-info">
                    <span>⭐ {book.volumeInfo.averageRating || "No Ratings"}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No books available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;