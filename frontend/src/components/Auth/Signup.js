import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createUserWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { doc, setDoc, getDoc, /*getFirestore*/ serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;
  
      // Check if the username is already taken
      const usernameRef = doc(db, "usernames", username);
      const usernameDoc = await getDoc(usernameRef);
      if (usernameDoc.exists()) {
        setError("Username is already taken. Please choose another one.");
        return;
      }
  
      // Add user details to Firestore
      await setDoc(doc(db, "users", userID), {
        userID,
        username,
        email,
        createdAt: serverTimestamp(),
      });
      console.log("User details saved successfully to Firestore");
  
      navigate("/login"); // Redirect to Home page after successful signup
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
  
      // Check if the user already exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "GoogleUser",
          email: user.email,
          userID: user.uid,
          createdAt: new Date(),
        });
        console.log("New Google user added to Firestore");
      } else {
        console.log("Google user already exists in Firestore");
      }
  
      navigate("/"); // Redirect to home page
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
        Sign Up with Google
      </button>
    </div>
  );
};

export default Signup;