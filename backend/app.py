from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["*"]}})

API_KEY = os.getenv("REACT_APP_API_KEY")
print("Loaded API Key:", API_KEY)

@app.route("/api/books", methods=["GET"])
def get_books():
    query = request.args.get("query", "bestsellers")
    max_results = request.args.get("maxResults", 10)
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {"q": query, "maxResults": max_results, "key": API_KEY}

    response = requests.get(url, params=params)
    return jsonify(response.json().get("items", []))

# ✅ Add the missing book details route
@app.route("/api/books/<book_id>", methods=["GET"])
def get_book_details(book_id):
    url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error if request fails
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch book details: {str(e)}"}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)