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
        email = data.get("email")
        password = data.get("password")

        print(f"DEBUG: Received login attempt for email: {email}")

        if not email or not password:
            print("DEBUG: Email or password is missing")
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})
        print(f"DEBUG: Retrieved user from DB: {user}")

        if not user:
            print("DEBUG: No user found with this email")
            return jsonify({"error": "Invalid email or password"}), 401

        stored_password = user.get("password")

        if stored_password is None:
            print("DEBUG: User password not found in DB")
            return jsonify({"error": "Invalid or missing password. Please reset your password."}), 401

        print(f"DEBUG: Stored password from DB: {stored_password}")

        if not stored_password.startswith("$2b$"):
            print("DEBUG: Password is not a bcrypt hash")
            return jsonify({"error": "Invalid password format. Please reset your password."}), 401

        # Convert stored password to bytes for bcrypt
        stored_password = stored_password.encode("utf-8")
        password = password.encode("utf-8")

        print("DEBUG: Checking bcrypt password match...")
        # Check if entered password matches stored hashed password
        if not bcrypt.checkpw(password, stored_password):
            print("DEBUG: Passwords do not match")
            return jsonify({"error": "Invalid email or password"}), 401

        print("DEBUG: Password match successful")

        user_data = {
            "id": str(user["_id"]),
            "fullName": user.get("fullName", ""),
            "gender": user.get("gender", ""),
            "age": user.get("age", ""),
            "email": user.get("email", ""),
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
