import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
import "./Signup.css";
import googleLogo from "./google-icon.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false); 
  const [emailValidation, setEmailValidation] = useState(null);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_HUNTER_API_KEY; 

  // 📌 Validate email format (Basic Check)
  const validateEmailFormat = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 📌 Verify email using Hunter.io API
  const validateEmailWithHunter = async (email) => {
    if (!email) return;

    try {
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${API_KEY}`
      );
      const data = await response.json();

      if (data.errors) {
        return { valid: false, message: "❌ Invalid API request." };
      }

      const status = data.data.status; 

      if (status === "valid") {
        return { valid: true, message: "✅ Email is valid!" };
      } else if (status === "invalid") {
        return { valid: false, message: "❌ Invalid email address." };
      } else {
        return { valid: false, message: "⚠️ Unable to verify email." };
      }
    } catch (error) {
      console.error("Hunter.io API error:", error);
      return { valid: false, message: "❌ Error verifying email." };
    }
  };

  // 📌 Handle real-time email validation
  const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (!validateEmailFormat(newEmail)) {
      setEmailValidation({ valid: false, message: "❌ Invalid email format." });
      return;
    }

    setEmailValidation({ valid: null, message: "⏳ Checking email validity..." });

    clearTimeout(window.emailTimeout);
    window.emailTimeout = setTimeout(async () => {
      const result = await validateEmailWithHunter(newEmail);
      setEmailValidation(result);
    }, 1000);
  };

  // 📌 Handle Signup Process
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmailFormat(email)) {
      setError("❌ Invalid email format. Please enter a valid email.");
      return;
    }

    if (!emailValidation || !emailValidation.valid) {
      setError("❌ This email address cannot receive messages. Please use a valid email.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;

      await auth.currentUser?.getIdToken(true);

      // Check if username exists
      const usernameRef = doc(db, "usernames", username);
      const usernameDoc = await getDoc(usernameRef);
      if (usernameDoc.exists()) {
        setError("❌ Username is already taken. Please choose another one.");
        return;
      }

      // Store user in Firestore
      await setDoc(doc(db, "users", userID), {
        userID,
        username,
        email,
        createdAt: serverTimestamp(),
        followers: [],
        following: [],
      });

      // 📌 Send Email Verification
      await sendEmailVerification(auth.currentUser);
      setShowThankYouModal(true);
    } catch (err) {
      console.error("Error during signup process:", err);
      setError(err.message);
    }
  };

  // 📌 Handle Google Sign-in
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
          following: [],
        });
        console.log("New Google user added to Firestore");
      }

      setShowThankYouModal(true); 
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
          onChange={handleEmailChange}
          required
        />
        {emailValidation && (
          <p className={emailValidation.valid ? "valid-message" : "error-message"}>
            {emailValidation.message}
          </p>
        )}
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
              Please check your inbox to verify your email before logging in.
            </p>
            <button onClick={() => navigate("/login")}>Proceed to Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;