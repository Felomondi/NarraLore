import mysql.connector
from flask import current_app

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="yourpassword",
        database="book_review"
    )
    return conn

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        rating INT CHECK(rating BETWEEN 1 AND 5),
        review_text TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    conn.commit()
    conn.close()