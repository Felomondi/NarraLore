# Remove JWT and auth routes references
from flask import Flask
from flask_cors import CORS
# Remove: from flask_jwt_extended import JWTManager
from routes.book_routes import book_routes
from routes.review_routes import review_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Remove JWT configuration
# app.config["JWT_SECRET_KEY"] = "..." 
# jwt = JWTManager(app)

# Remove auth routes registration
app.register_blueprint(book_routes)
app.register_blueprint(review_routes)