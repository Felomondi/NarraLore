import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Your firebase config
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./components/Home";
import BookDetail from "./components/BookDetail";
import Profile from "./components/Profile";
import Sidebar from "./components/Sidebar";
import DiscoverFriends from "./components/DiscoverFriends";

const Layout = ({ children, user, isSidebarOpen, setIsSidebarOpen, isSmallScreen, handleLogout }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>; // Render auth pages without layout
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar
          isOpen={isSidebarOpen}
          isSmallScreen={isSmallScreen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          onLogout={handleLogout}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Navbar
            user={user}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSmallScreen={isSmallScreen}
            onLogout={handleLogout}
          />
          <div className="content" style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// New ProtectedRoute Component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null); // Track user state globally
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state when auth state changes
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <Layout
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSmallScreen={isSmallScreen}
        handleLogout={handleLogout}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute user={user}>
                <BookDetail user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover-friends"
            element={
              <ProtectedRoute user={user}>
                <DiscoverFriends user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;