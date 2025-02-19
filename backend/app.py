import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://resilient-cascaron-f9eab6.netlify.app/", "https://litlore.com"]}})

API_KEY = os.getenv("REACT_APP_API_KEY")  # Use environment variable for API key

@app.route("/api/books", methods=["GET"])
def get_books():
    try:
        params = {
            "q": request.args.get("query", "bestsellers"),
            "maxResults": request.args.get("maxResults", 10),
            "key": API_KEY
        }
        response = requests.get("https://www.googleapis.com/books/v1/volumes", params=params)
        response.raise_for_status()
        return jsonify(response.json().get("items", []))
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch books: {str(e)}"}), 500

@app.route("/api/books/<book_id>", methods=["GET"])
def get_book_details(book_id):
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}")
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch book details: {str(e)}"}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # Cloud Run requires PORT=8080
    app.run(host="0.0.0.0", port=port, debug=True)  # Listen on all interfaces