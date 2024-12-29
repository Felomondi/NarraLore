from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_routes
from routes.book_routes import book_routes
from routes.review_routes import review_routes

app = Flask(__name__)
@app.route('/')
def home():
    return "Welcome to the Book Critique API!"

CORS(app)
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"

jwt = JWTManager(app)

app.register_blueprint(auth_routes)
app.register_blueprint(book_routes)
app.register_blueprint(review_routes)

if __name__ == "__main__":
    app.run(debug=True)