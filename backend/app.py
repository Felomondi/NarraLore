from flask import Flask
from flask_cors import CORS
from routes.book_routes import book_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.register_blueprint(book_routes)

if __name__ == "__main__":
    app.run(debug=True)