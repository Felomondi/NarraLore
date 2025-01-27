import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
import os

load_dotenv()
book_routes = Blueprint("books", __name__)
API_KEY = os.getenv("API_KEY")

@book_routes.route("/api/books", methods=["GET"])
def get_books():
    try:
        params = {
            "q": request.args.get("query", "bestsellers"),
            "maxResults": request.args.get("maxResults", 40),
            "key": API_KEY
        }
        response = requests.get("https://www.googleapis.com/books/v1/volumes", params=params)
        response.raise_for_status()
        return jsonify(response.json().get("items", []))
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch books: {str(e)}"}), 500

@book_routes.route("/api/books/<book_id>", methods=["GET"])
def get_book_details(book_id):
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}")
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch book details: {str(e)}"}), 404
    
@book_routes.before_request
def limit_remote_addr():
    if request.remote_addr not in ['127.0.0.1', 'your-production-ip']:
        return jsonify({"error": "Forbidden"}), 403
