# profile.py

import urllib.parse
import logging
from pymongo import MongoClient

# --- MongoDB Connection Setup ---

password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)

mongo_uri = (
    f"mongodb+srv://admin:{encoded_password}"
    "@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)

client = MongoClient(mongo_uri)
db = client["SafeMind"]
users_collection = db["user_credentiels"]

# Enable logging
logging.basicConfig(level=logging.INFO)

# --- Profile Update Function ---

def update_user_profile(data):
    try:
        username = data.get("username")
        if not username:
            return {"success": False, "message": "Username is required."}

        update_fields = {k: v for k, v in data.items() if k != "username"}

        result = users_collection.update_one(
            {"username": username},
            {"$set": update_fields}
        )

        if result.modified_count == 1:
            logging.info("User profile updated for: %s", username)
            return {"success": True}
        elif result.matched_count == 1:
            return {"success": False, "message": "No changes made."}
        else:
            return {"success": False, "message": "User not found."}
    except Exception as e:
        logging.error(f"Error updating user profile: {str(e)}")
        return {"success": False, "error": str(e)}
