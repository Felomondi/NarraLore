import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",  # Hostname (update if your DB is remote)
        user="root",  # Replace with your MySQL username
<<<<<<< HEAD
        password="Your DB password goes here",  # Replace with your MySQL password
=======
        password= os.getenv("DATABASE_PASSWORD"),  # Replace with your MySQL password
>>>>>>> cfbf52a (add bookdetails)
        database="bookCritique_db"  # Your database name
    )
    return connection
