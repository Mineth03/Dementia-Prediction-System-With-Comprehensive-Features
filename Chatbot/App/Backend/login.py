from flask import request, jsonify
from pymongo import MongoClient
import urllib
import bcrypt
import jwt
import datetime

# CONNECT TO MONGODB
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client["SafeMind"]
users_collection = db["user_credentiels"]

def login_user():
    try:
        data = request.get_json()
        username = data.get("username")  # ✅ UPDATED TO USE USERNAME INSTEAD OF EMAIL
        password = data.get("password")

        print(f"DEBUG: Received login attempt for username: {username}")

        if not username or not password:
            print("DEBUG: Username or password is missing")
            return jsonify({"error": "Username and password are required"}), 400

        user = users_collection.find_one({"username": username})  # ✅ LOOK UP USER BY USERNAME
        print(f"DEBUG: Retrieved user from DB: {user}")

        if not user:
            print("DEBUG: No user found with this username")
            response = jsonify({"error": "Invalid username or password"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 401

        stored_password = user.get("password")

        if stored_password is None:
            print("DEBUG: User password not found in DB")
            return jsonify({"error": "Invalid or missing password. Please reset your password."}), 401

        print(f"DEBUG: Stored password from DB: {stored_password}")

        # FIX: ENSURE PASSWORD IS A STRING BEFORE ENCODING
        if not isinstance(stored_password, str):
            print("DEBUG ERROR: Stored password is not a string!")
            return jsonify({"error": "Invalid stored password format. Please reset your password."}), 500

        # CONVERT STORED PASSWORD TO BYTES FOR BCRYPT
        stored_password = stored_password.encode("utf-8")
        password = password.encode("utf-8")

        print("DEBUG: Checking bcrypt password match...")
        # CHECK IF ENTERED PASSWORD MATCHES STORED HASHED PASSWORD
        if not bcrypt.checkpw(password, stored_password):
            print("DEBUG: Passwords do not match")
            response = jsonify({"error": "Invalid username or password"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 401

        print("DEBUG: Password match successful")

        user_data = {
            "id": str(user["_id"]),
            "fullName": user.get("fullName", ""),
            "gender": user.get("gender", ""),
            "age": user.get("age", ""),
            "username": user.get("username", ""),  # ✅ RETURN USERNAME IN RESPONSE
            "phone": user.get("phone", ""),
        }

        # GENERATE JWT TOKEN
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
