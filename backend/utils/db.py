import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",  # Hostname (update if your DB is remote)
        user="root",  # Replace with your MySQL username
        password= os.getenv("DATABASE_PASSWORD"),  # Replace with your MySQL password
        database="bookCritique_db"  # Your database name
    )
    return connection
