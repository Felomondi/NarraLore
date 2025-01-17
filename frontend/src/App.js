import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import BookDetail from "./components/BookDetail";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track screen size

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Set to true for small screens
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true); // Ensure sidebar is open on larger screens
      } else {
        setIsSidebarOpen(false); // Automatically close sidebar on smaller screens
      }
    };

    handleResize(); // Run on component mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar
            isOpen={isSidebarOpen}
            isSmallScreen={isSmallScreen} // Pass screen size to Sidebar
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            user={user}
            onLogout={handleLogout}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Navbar
              user={user}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isSmallScreen={isSmallScreen} // Pass screen size to Navbar
            />
            <div className="content" style={{ flex: 1, overflowY: "auto" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/book/:id" element={<BookDetail />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;