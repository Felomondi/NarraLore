import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
import os

load_dotenv()

book_routes = Blueprint("books", __name__)

# Load the API key from an environment variable
API_KEY = os.getenv("API_KEY")

# Route to fetch books by category or query
@book_routes.route("/api/books", methods=["GET"])
def get_books():
    query = request.args.get("query", "bestsellers")  # Default query is "bestsellers"
    max_results = request.args.get("maxResults", 40)  # Default to maximum allowable by API (40)
    
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults={max_results}&key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors

        # Get books from API response
        books = response.json().get("items", [])
        return jsonify(books)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch books: {str(e)}"}), 500

# Route to fetch book details by ID
@book_routes.route("/api/books/<book_id>", methods=["GET"])
def get_book_details(book_id):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors

        # Get book details from API response
        book = response.json()
        return jsonify(book)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch book details: {str(e)}"}), 404