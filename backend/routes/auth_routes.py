from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from utils.db import get_db_connection

auth_routes = Blueprint("auth", __name__)

@auth_routes.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        password_hash = generate_password_hash(password)

        # Check if username or email already exists
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            return jsonify({"error": "Username or email already exists"}), 409

        # Insert new user
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )
        connection.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": "Server error: " + str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@auth_routes.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch user details by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user["password_hash"], password):
            token = create_access_token(identity=str(user["id"]))  # Ensure ID is a string
            return jsonify({"token": token, "user": {"id": str(user["id"]), "username": user["username"]}})
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": "Server error: " + str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@auth_routes.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        # Extract the user ID from the token
        user_id = get_jwt_identity()

        if not isinstance(user_id, str):
            return jsonify({"msg": "Invalid token format: user_id must be a string"}), 422

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch user details
        cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()