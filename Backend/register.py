# register.py
from flask import request, jsonify
from pymongo import MongoClient
import urllib
import bcrypt
from email_verification import verify_email

# CONNECT TO MONGODB
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client["SafeMind"]
users_collection = db["user_credentiels"]

def register_user():
    data = request.get_json()
    full_name = data.get("fullName")
    username = data.get("username")
    gender = data.get("gender")
    age = data.get("age")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password").encode("utf-8")

    # ✅ Check if the email is valid and exists
    if not verify_email(email):
        return jsonify({"error": "Invalid email address or email does not exist"}), 400

    # ✅ CHECK IF USERNAME IS ALREADY REGISTERED
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username is already taken"}), 400

    # ✅ CHECK IF EMAIL OR PHONE IS ALREADY REGISTERED
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email is already registered"}), 400
    if users_collection.find_one({"phone": phone}):
        return jsonify({"error": "Phone number is already registered"}), 400

    # ✅ HASH PASSWORD BEFORE STORING
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

    # ✅ INSERT USER DETAILS INTO DATABASE
    users_collection.insert_one({
        "fullName": full_name,
        "username": username,
        "gender": gender,
        "age": age,
        "email": email,
        "phone": phone,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201
