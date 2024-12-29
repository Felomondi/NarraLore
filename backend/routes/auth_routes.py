from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash
from utils.db import get_db_connection
import mysql.connector

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
        existing_user = cursor.fetchone()
        if existing_user:
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

    print("Login attempt with email:", email)  # Log the incoming email
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch user details by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        print("Fetched user:", user)  # Log fetched user data

        if user and check_password_hash(user["password_hash"], password):
            token = create_access_token(identity=user["id"])
            print("Login successful for user:", user["username"])  # Log success
            return jsonify({"token": token, "user": {"id": user["id"], "username": user["username"]}})
        else:
            print("Invalid credentials for email:", email)  # Log invalid login attempt
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print("Error during login:", str(e))  # Log the exception
        return jsonify({"error": "Server error: " + str(e)}), 500
    finally:
        cursor.close()
        connection.close()