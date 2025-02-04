import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
import "./Signup.css";
import googleLogo from "./google-icon.png"; // Adjust the path if needed

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;

      // Force a fresh token so Firestore sees the newly created user
      await auth.currentUser?.getIdToken(true);

      const usernameRef = doc(db, "usernames", username);
      const usernameDoc = await getDoc(usernameRef);
      if (usernameDoc.exists()) {
        setError("Username is already taken. Please choose another one.");
        return;
      }

      await setDoc(doc(db, "users", userID), {
        userID,
        username,
        email,
        createdAt: serverTimestamp(),
        followers: [],
        following: []
      });

      setShowThankYouModal(true); // Show modal on successful signup
    } catch (err) {
      console.error("Error during signup process:", err);
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);

      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "GoogleUser",
          email: user.email,
          userID: user.uid,
          createdAt: new Date(),
          followers: [],
          following: []
        });
        console.log("New Google user added to Firestore");
      }

      setShowThankYouModal(true); // Show modal for Google signup as well
    } catch (err) {
      console.error("Error during Google signup:", err);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Signup</button>
      </form>
      <div className="separator">OR</div>
      <button className="google-signin-button" onClick={handleGoogleSignIn}>
        <img src={googleLogo} alt="Google Logo" className="google-icon" />
        Sign Up with Google
      </button>
      <p className="toggle-auth">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>

      {showThankYouModal && (
        <div className="thank-you-modal-overlay">
          <div className="thank-you-modal">
            <h3>Thank You for Signing Up! ❤️</h3>
            <p>
              Your account has been successfully created. Please log in to continue using our
              website. If you used your Google account to sign up, please use the same account to
              log in.
            </p>
            <button onClick={() => navigate("/login")}>Proceed to Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;