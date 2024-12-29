import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
import os

load_dotenv()

book_routes = Blueprint("books", __name__)

# Load the API key from an environment variable or hardcode it (not recommended for production)
<<<<<<< HEAD
API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY", "API key goes here")
=======
#API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY", "AIzaSyBjzi13Hcj6T-lldQnDASDj42XrdMk8QYc")
API_KEY = os.getenv("API_KEY")
>>>>>>> cfbf52a (add bookdetails)

# Route to fetch bestsellers
@book_routes.route("/api/books", methods=["GET"])
def get_bestsellers():
    query = request.args.get("query", "bestsellers")  # Use "bestsellers" as default query
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors
        books = response.json().get("items", [])
        return jsonify(books)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
<<<<<<< HEAD
=======

# Route to fetch book details by ID
@book_routes.route("/api/books/<book_id>", methods=["GET"])
def get_book_details(book_id):
    url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        book = response.json()
        return jsonify(book)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch book details: {str(e)}"}), 404
>>>>>>> cfbf52a (add bookdetails)
