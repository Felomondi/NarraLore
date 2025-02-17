import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Login.css";
import googleLogo from "./google-icon.png"; // Adjust the path if needed
import { sendEmailVerification } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await sendEmailVerification(user);
        return;
      }
  
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
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
        });
        console.log("New user added to Firestore:", user.uid);
      }
      navigate("/"); // Redirect to home page
    } catch (err) {
      console.error("Error during Google login:", err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div className="separator">OR</div>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        <img src={googleLogo} alt="Google Logo" className="google-icon" />
        Login with Google
      </button>
      <p className="toggle-auth">
        Don’t have an account? <Link to="/signup">Sign up here</Link>.
      </p>
    </div>
  );
};

export default Login;