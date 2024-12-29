import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [editorsPicks, setEditorsPicks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [newReleasesResponse, topRatedResponse, editorsPicksResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/books?query=new_releases'),
          axios.get('http://127.0.0.1:5000/api/books?query=top_rated'),
          axios.get('http://127.0.0.1:5000/api/books?query=editors_picks'),
        ]);
  
        setNewReleases(newReleasesResponse.data || []);
        setTopRated(topRatedResponse.data || []);
        setEditorsPicks(editorsPicksResponse.data || []);
  
        // Log updated state
        // console.log("Updated New Releases State:", newReleases);
        // console.log("Updated Top Rated State:", topRated);
        // console.log("Updated Editor's Picks State:", editorsPicks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
  
    fetchBooks();
  }, []);

  return (
    <div className="homepage-container">
      <h1>Book Critique</h1>

      <h2>New Releases</h2>
      <div className="books-grid">
        {newReleases.length > 0 ? (
          newReleases.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card">
              <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
            </Link>
          ))
        ) : (
          <p>No new releases available</p>
        )}
      </div>

      <h2>Top Rated</h2>
      <div className="books-grid">
        {topRated.length > 0 ? (
          topRated.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card">
              <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
            </Link>
          ))
        ) : (
          <p>No top rated books available</p>
        )}
      </div>

      <h2>Editor's Picks</h2>
      <div className="books-grid">
        {editorsPicks.length > 0 ? (
          editorsPicks.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card">
              <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
            </Link>
          ))
        ) : (
          <p>No editor's picks available</p>
        )}
      </div>
    </div>);
};

export default Home;