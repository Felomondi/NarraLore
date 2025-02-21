import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { bookService } from "../services/api";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Home.scss";

const categories = [{ title: "Romance", query: "romance" }];

const curatedCategories = [
  "Motivation", "Poem", "Biography", "Novel", "Fiction", "Non-Fiction",
  "Literature", "Romance", "Career", "Lifestyle", "Psychology",
  "Culture", "Gym", "Self Development", "Technology", "Finance",
  "Short Story", "Life", "Cons"
];

const CACHE_TTL = 3600000; // 1 hour

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(curatedCategories[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [bookRatings, setBookRatings] = useState({});
  const [bookComments, setBookComments] = useState({});
  const selfHelpGridRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Hi, Welcome to LitLore.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust speed if needed
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch Books by Category using useQueries
  const booksByCategoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["booksByCategory", category.query],
      queryFn: () => bookService.getBooks(category.query, 10).then((res) => res.data),
      staleTime: CACHE_TTL,
    })),
  });

  // Combine results into one object for easy access
  const booksByCategory = {};
  booksByCategoryQueries.forEach((query, index) => {
    booksByCategory[categories[index].title] = query.data || [];
  });

  // 2. Fetch Self-Help Books (single object syntax)
  const {
    data: selfHelpBooks = [],
    isLoading: isSelfHelpLoading,
  } = useQuery({
    queryKey: ["selfHelpBooks"],
    queryFn: () => bookService.getBooks("self_help", 10).then((res) => res.data),
    staleTime: CACHE_TTL,
  });

  console.log("📚 Self-Help Books:", selfHelpBooks);  // 🔥 Log API response

  // 3. Fetch Curated Books (depends on selectedCategory)
  const {
    data: curatedBooks = [],
    isLoading: isCuratedBooksLoading,
  } = useQuery({
    queryKey: ["curatedBooks", selectedCategory],
    queryFn: () => bookService.getBooks(selectedCategory, 10).then((res) => res.data),
    staleTime: CACHE_TTL,
    enabled: !isSearchActive,
  });
  console.log("📚 Curated Books:", curatedBooks);  // 🔥 

  // 4. Set up a search query (disabled until manually triggered)
  const {
    data: searchResults = [],
    refetch: refetchSearch,
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: ["searchBooks", searchQuery],
    queryFn: () =>
      bookService.getBooks(encodeURIComponent(searchQuery), 10).then((res) => res.data),
    enabled: false,
    staleTime: CACHE_TTL,
  });

  // Function to fetch average ratings and comments
  const fetchAverageRatingsAndComments = async (books) => {
    if (!books) return;
    const ratingsData = {};
    const commentsData = {};

    for (const book of books) {
      const bookID = book.id;
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("bookId", "==", bookID));
      const querySnapshot = await getDocs(q);

      let totalRating = 0;
      let numRatings = 0;
      let numComments = 0;

      querySnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
        numRatings++;
        if (doc.data().content) {
          numComments++;
        }
      });

      ratingsData[bookID] = numRatings > 0 ? (totalRating / numRatings).toFixed(1) : "No Ratings Yet";
      commentsData[bookID] = numComments;
    }

    setBookRatings((prev) => ({ ...prev, ...ratingsData }));
    setBookComments((prev) => ({ ...prev, ...commentsData }));
  };

  // Update ratings and comments when self-help books load
  useEffect(() => {
    if (selfHelpBooks.length) {
      fetchAverageRatingsAndComments(selfHelpBooks);
    }
  }, [selfHelpBooks]);

  // Update ratings and comments when curated books load
  useEffect(() => {
    if (curatedBooks.length) {
      fetchAverageRatingsAndComments(curatedBooks);
    }
  }, [curatedBooks]);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      return;
    }
    setIsSearchActive(true);
    await refetchSearch();
    // Optionally fetch ratings and comments for searchResults once available
    fetchAverageRatingsAndComments(searchResults);
  };

  // Handler for clicking a curated category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsSearchActive(false);
  };

  // Horizontal scrolling for self-help grid
  const scrollHorizontally = (direction) => {
    if (selfHelpGridRef.current) {
      const scrollAmount = 300;
      selfHelpGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Determine overall loading state
  const loading = isSelfHelpLoading || isCuratedBooksLoading || isSearchLoading;

  return (
    <div className="homepage-container">
      {/* Header / Mockup Section */}
      <div className="dotted-background">
        <div className="mockup-content">
          <h1>{displayedText}</h1>
          <h2>A Social Platform for Book Reviews!</h2>
          <p>
            <span className="benefit">✍️ Write insightful book reviews.</span>
            <span className="benefit">⭐ Rate your favorite books and see what’s trending.</span>
            <span className="benefit">👥 Follow friends & see what they’re reading.</span>
            <span className="benefit">💬 Join the discussion – comment & like reviews.</span>
            <span className="benefit">📱 Coming soon: LitLore for iOS & Android! 🚀</span>
          </p>
        </div>
      </div>

      {/* Self-Help Section */}
      <div className="self-help-section">
        <div className="self-help-header">
          <h2><i className="fas fa-leaf icon"></i> Recommended Self-Help Books</h2>
        </div>
        <div className="scroll-buttons-container">
          <button className="scroll-button left" onClick={() => scrollHorizontally("left")}>
            &#8249;
          </button>
          <button className="scroll-button right" onClick={() => scrollHorizontally("right")}>
            &#8250;
          </button>
        </div>
        <div className="self-help-grid" ref={selfHelpGridRef}>
          {selfHelpBooks.length > 0 ? (
            selfHelpBooks.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id} className="self-help-card">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.volumeInfo.title}
                />
                <div className="self-help-card-content">
                  <p>{book.volumeInfo.authors?.join(", ")}</p>
                  <h3>{book.volumeInfo.title}</h3>
                  <div className="self-help-rating">
                    <span>⭐ {bookRatings[book.id] || "No Ratings Yet"}</span>
                    <span className="comments-count">
                      <i className="fas fa-comment"></i> {bookComments[book.id] || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No Self-Help books available</p>
          )}
        </div>
      </div>

      {/* Curated Books Section */}
      <div className="curated-section">
        <div className="curated-header">
          <h2><i className="fas fa-book"></i> Curated Book Collection</h2>
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
              className={`category-button ${selectedCategory === category ? "active" : ""}`}
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
                <Link to={`/book/${book.id}`} key={book.id} className="curated-card">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                    alt={book.volumeInfo.title}
                  />
                  <div className="curated-card-content">
                    <p>{book.volumeInfo.authors?.join(", ")}</p>
                    <h3>{book.volumeInfo.title}</h3>
                    <div className="curated-card-info">
                      <span>⭐ {bookRatings[book.id] || "No Ratings Yet"}</span>
                      <span className="comments-count">
                        <i className="fas fa-comment"></i> {bookComments[book.id] || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No books found.</p>
            )
          ) : curatedBooks.length > 0 ? (
            curatedBooks.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id} className="curated-card">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.volumeInfo.title}
                />
                <div className="curated-card-content">
                  <p>{book.volumeInfo.authors?.join(", ")}</p>
                  <h3>{book.volumeInfo.title}</h3>
                  <div className="curated-card-info">
                    <span>⭐ {bookRatings[book.id] || "No Ratings Yet"}</span>
                    <span className="comments-count">
                      <i className="fas fa-comment"></i> {bookComments[book.id] || 0}
                    </span>
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