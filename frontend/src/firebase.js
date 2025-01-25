// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import getAuth
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEBiIIKw1WmJ6yIfU_Gex7EypCfZFYjWo",
  authDomain: "litlore-fd533.firebaseapp.com",
  projectId: "litlore-fd533",
  storageBucket: "litlore-fd533.firebasestorage.app",
  messagingSenderId: "949850160905",
  appId: "1:949850160905:web:1af45bcdc9387687fdddd8",
  measurementId: "G-CCL13WQXRZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app); // Correctly use getAuth
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app); // Initialize Storage

// Track auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("No user logged in");
  }
});

export { auth, db, googleProvider, storage };