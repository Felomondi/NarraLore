import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",  # Hostname (update if your DB is remote)
        user="root",  # Replace with your MySQL username
        password="Your DB password goes here",  # Replace with your MySQL password
        database="bookCritique_db"  # Your database name
    )
    return connection
