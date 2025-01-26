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

# Remove user-related models, keep only reviews table
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Remove users table creation
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(255) NOT NULL,  # Change to string for Firebase UID
        rating INT CHECK(rating BETWEEN 1 AND 5),
        review_text TEXT
    )
    """)
    conn.commit()
    conn.close()