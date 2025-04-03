from flask import request, jsonify
from pymongo import MongoClient
import urllib
import bcrypt
import jwt
import datetime

# Connect to MongoDB
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client["SafeMind"]
users_collection = db["user_credentiels"]

def login_user():
    try:
        data = request.get_json()
        email_or_username = data.get("email_or_username")  # Match frontend field
        password = data.get("password")

        print(f"DEBUG: Received login attempt for email/username: {email_or_username}")

        if not email_or_username or not password:
            print("DEBUG: Email/Username or password is missing")
            return jsonify({"error": "Email/Username and password are required"}), 400

        # Find user using either email or username
        user = users_collection.find_one({
            "$or": [{"email": email_or_username}, {"username": email_or_username}]
        })
        print(f"DEBUG: Retrieved user from DB: {user}")

        if not user:
            print("DEBUG: No user found with this email/username")
            return jsonify({"error": "Invalid email/username or password"}), 401

        stored_password = user.get("password")
        if not stored_password or not stored_password.startswith("$2b$"):
            print("DEBUG: Password format invalid or missing")
            return jsonify({"error": "Invalid or missing password. Please reset your password."}), 401

        # Convert passwords to bytes for bcrypt comparison
        if not bcrypt.checkpw(password.encode("utf-8"), stored_password.encode("utf-8")):
            print("DEBUG: Passwords do not match")
            return jsonify({"error": "Invalid email/username or password"}), 401

        print("DEBUG: Password match successful")

        # Construct user data object
        user_data = {
            "id": str(user["_id"]),
            "fullName": user.get("fullName", ""),
            "gender": user.get("gender", ""),
            "age": user.get("age", ""),
            "email": user.get("email", ""),
            "username": user.get("username", ""),
            "phone": user.get("phone", ""),
        }

        # Generate JWT Token
        token = jwt.encode(
            {"user_id": user_data["id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
            "your_secret_key",
            algorithm="HS256"
        )

        print("DEBUG: Login successful, returning user data and token")
        return jsonify({"message": "Login successful", "user": user_data, "token": token}), 200

    except Exception as e:
        print(f"DEBUG ERROR: Server error occurred: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
