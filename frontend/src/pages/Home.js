import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const categories = [
  { title: "New Releases", query: "new_releases" },
  { title: "Top Rated", query: "top_rated" },
  { title: "Editor's Picks", query: "editors_picks" },
  { title: "Science Fiction", query: "science_fiction" },
  { title: "Romance", query: "romance" },
  { title: "Biographies", query: "biographies" },
];

const Home = () => {
  const [booksByCategory, setBooksByCategory] = useState({});

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const promises = categories.map((category) =>
          axios.get(`http://127.0.0.1:5000/api/books?query=${category.query}`)
        );

        const responses = await Promise.all(promises);

        // Map responses to category titles
        const booksData = responses.reduce((acc, response, index) => {
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

  return (
    <div className="homepage-container">
      <h1>Book Critique</h1>
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
                  <h3>{book.volumeInfo.title}</h3>
                  <p>{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
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