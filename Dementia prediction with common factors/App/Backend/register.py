from flask import request, jsonify
from pymongo import MongoClient
import urllib
import bcrypt

# Connect to MongoDB
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client["SafeMind"]
users_collection = db["user_credentiels"]

def register_user():
    data = request.get_json()
    full_name = data.get("fullName")
    gender = data.get("gender")
    age = data.get("age")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password").encode("utf-8")  # Convert password to bytes for bcrypt

    # Check if email or phone is already registered
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email is already registered"}), 400
    if users_collection.find_one({"phone": phone}):
        return jsonify({"error": "Phone number is already registered"}), 400

    # Hash the password before storing
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

    # Insert user details into the database
    users_collection.insert_one({
        "fullName": full_name,
        "gender": gender,
        "age": age,
        "email": email,
        "phone": phone,
        "password": hashed_password  # Store the hashed password
    })

    return jsonify({"message": "User registered successfully"}), 201
