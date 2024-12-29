from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db_connection

review_routes = Blueprint("reviews", __name__)

@review_routes.route("/api/reviews", methods=["POST"])
@jwt_required()
def add_review():
    data = request.get_json()
    user_id = get_jwt_identity()
    book_id, rating, review_text = data["book_id"], data["rating"], data["review_text"]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO reviews (book_id, user_id, rating, review_text) VALUES (%s, %s, %s, %s)",
                   (book_id, user_id, rating, review_text))
    conn.commit()
    conn.close()
    return jsonify({"message": "Review added successfully"}), 201

@review_routes.route("/api/user/reviews", methods=["GET"])
@jwt_required()
def get_user_reviews():
    user_id = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reviews WHERE user_id = %s", (user_id,))
    reviews = cursor.fetchall()
    conn.close()
    return jsonify(reviews)


    