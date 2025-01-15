import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

// Define all categories
const categories = [
  { title: "New Releases", query: "new_releases" },
  // { title: "Top Rated", query: "top_rated" },
  // { title: "Editor's Picks", query: "editors_picks" },
  { title: "Science Fiction", query: "science_fiction" },
  { title: "Romance", query: "romance" },
  // { title: "Biographies", query: "biography" },
  { title: "Mystery & Thriller", query: "mystery" },
  { title: "Fantasy", query: "fantasy" },
  // { title: "History", query: "history" },
  // { title: "Self-Help", query: "self_help" },
  // { title: "Business & Economics", query: "business" },
  // { title: "Health & Fitness", query: "health" },
  // { title: "Travel", query: "travel" },
  // { title: "Comics & Graphic Novels", query: "comics" },
  // { title: "Cookbooks", query: "cooking" },
  // { title: "Children's Books", query: "children" },
  // { title: "Poetry", query: "poetry" },
];

const Home = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const refs = useRef({}); // Store refs for each category

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const promises = categories.map((category) =>
          axios.get(`http://127.0.0.1:5000/api/books?query=${category.query}&maxResults=10`)
        );

        const responses = await Promise.all(promises);

        const booksData = responses.reduce((acc, response, index) => {
          console.log(`Category: ${categories[index].title}`, response.data);
          acc[categories[index].title] = response.data || [];
          return acc;
        }, {});

        setBooksByCategory(booksData);
      } catch (error) {
        console.error("Error fetching books by category:", error);
      }
    };

    fetchBooksByCategory();
  }, []);

  const scrollHorizontally = (categoryTitle, direction) => {
    const ref = refs.current[categoryTitle];
    if (ref && ref.scrollBy) {
      ref.scrollBy({
        left: direction === "left" ? -500 : 500, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    } else {
      console.error(`Ref not found or invalid for category: ${categoryTitle}`);
    }
  };

  return (
    <div className="homepage-container">
      <h1>Book Critique</h1>
      {categories.map((category) => (
        <div key={category.title} className="category-section">
          <h2>{category.title}</h2>
          <div className="scroll-buttons">
            <button
              className="scroll-button left"
              onClick={() => scrollHorizontally(category.title, "left")}
            >
              &#8249;
            </button>
            <div
              ref={(el) => (refs.current[category.title] = el)} // Attach ref to each category grid
              className="books-grid"
            >
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
                    {/* <h3>{book.volumeInfo.title}</h3> */}
                  </Link>
                ))
              ) : (
                <p>No books available in this category</p>
              )}
            </div>
            <button
              className="scroll-button right"
              onClick={() => scrollHorizontally(category.title, "right")}
            >
              &#8250;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;