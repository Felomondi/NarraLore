import requests
from flask import Blueprint, jsonify
import os

book_routes = Blueprint("books", __name__)

# Load the API key from an environment variable or hardcode it (not recommended for production)
API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY", "AIzaSyBjzi13Hcj6T-lldQnDASDj42XrdMk8QYc")

@book_routes.route("/api/books", methods=["GET"])
def get_bestsellers():
    query = "bestsellers"
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors
        books = response.json().get("items", [])
        return jsonify(books)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500