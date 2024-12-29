import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import BookDetail from "./components/BookDetail";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="page-wrapper">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/book/:id" element={<BookDetail />} /> {/* Dynamic Route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;