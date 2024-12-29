import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <Router>
      {/* Main Wrapper */}
      <div className="page-wrapper">
        {/* Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;