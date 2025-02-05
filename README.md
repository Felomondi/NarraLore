# 📖 **LitLore - A Social Book Discovery & Review Platform**  

Welcome to **LitLore**, an interactive book discovery and review platform that allows users to **explore books, write reviews, follow other readers, and engage in a reading community**. Whether you're looking for book recommendations, connecting with like-minded readers, or tracking your reading journey, LitLore provides the tools you need.  

---

## 🚀 **Features**  

### 📚 **Current Features-Already Implemented**  
✅ **Book Discovery** – Browse books from various categories and search for your favorite titles.  
✅ **Detailed Book Pages** – View descriptions, ratings, and metadata for each book.  
✅ **User Reviews & Ratings** – Leave a review and rate books (supports half-star ratings).  
✅ **Authentication System** – Secure **signup, login, and logout** with Firebase Authentication.  
✅ **Bookmarks & Favorites** – Save books for later reading.  
✅ **Follow & Followers System** – Follow other users and see who follows you.  
✅ **User Profiles** – View your reading activity, reviews, and connections.  
✅ **Friend Discovery** – Find and follow users based on their usernames.  
✅ **Responsive Design** – Optimized for **desktop, tablet, and mobile** devices.  

---

### 🔥 **Upcoming Features- The ones I am working on Currently**  
🟡 **Personalized Book Recommendations** – AI-based suggestions tailored to your reading history.  
🟡 **User Messaging System** – Direct messaging between users.  
🟡 **Reading Progress Tracking** – Keep track of books you're reading.  
🟡 **Custom User Avatars** – Upload custom profile pictures.  
🟡 **Dark Mode** – Switch between light and dark themes.  
🟡 **Free books from Project Gutenburg** - This really depends on whether I have enough storage to store the books to make them easy to access in pdf format. Not sure if cloud services like google cloud would require me to pay after a certain threshold.

---

## 💻 **Setup & Installation**  

### **1️⃣ Clone the Repository**  
```bash
git clone <link to this repo>
cd litlore
```
### 2️⃣ Install Dependencies
Navigate to the frontend folder and run the command:
```bash
npm install
```
### 3️⃣ Set Up Firebase
	1.	Go to Firebase Console and create a new project.
	2.	Set up Authentication, Firestore Database, and Storage.
	3.	Get your Firebase config credentials and update firebase.js:
 ```bash
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
### 4️⃣ Run the Development Server
Navigate to the backned 




