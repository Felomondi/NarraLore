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

#### **1️⃣ Clone the Repository**  
```bash
git clone <link to this repo>
cd litlore
```
### 🏗 Frontend Setup
#### 2️⃣ Install Dependencies
Navigate to the frontend folder and run the command:
```bash
npm install
```
#### 3️⃣ Set Up Firebase
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

### 🖥 Backend Setup
#### 1️⃣ Navigate to the Backend Directory
```bash
cd backend
```
### 2️⃣ Create a Virtual Environment (I used Python for Backend)
```bash
# For macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# For Windows:
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Set Up Environment Variables
```bash
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
```
## 🔄 Running Frontend & Backend Together
1.	Open two terminal windows.
2.	Start the backend:
```bash
cd backend
source venv/bin/activate  # (Or venv\Scripts\activate for Windows)
flask run
```

3.	Start the frontend(in the other terminal window):
```bash
cd frontend
npm start
```

## 🛠 Tech Stack
•	Frontend: React.js, CSS
•	Backend: Flask (Python)
•	Database: Firebase Firestore (NoSQL database)
•	Authentication: Firebase Authentication
•	Storage: Firebase Storage(Firestore basically and Firebase just for User info)
•	APIs: Google Books API(for book info. This might change soon), Custom Flask API

## 🤝 Contributing
I welcome contributions if you are interested in starting your open source journey! If you’d like to improve the project:
1.	Fork the repository
2.	Create a new branch (feature-branch)
3.	Make your changes
4.	Commit & Push
5.	Submit a Pull Request

##### 📩 Have suggestions or want to report a bug? Open an issue!
