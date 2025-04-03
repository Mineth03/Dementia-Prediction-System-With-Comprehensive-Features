# feedback.py
from pymongo import MongoClient
import logging
import urllib

# Connect to MongoDB
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client["SafeMind"]
feedback_collection = db['feedbacks']

def save_feedback(feedback):
    if not feedback or feedback.strip() == "":
        return {"error": "Feedback cannot be empty."}

    try:
        feedback_doc = {"feedback": feedback.strip()}
        feedback_collection.insert_one(feedback_doc)
        logging.info("Feedback saved successfully to MongoDB.")
        return {"message": "Thank you for your feedback!"}
    except Exception as e:
        logging.error(f"Error saving feedback to MongoDB: {str(e)}")
        return {"error": "Error saving feedback to database."}

def get_all_feedbacks():
    """
    Retrieve all feedbacks from the MongoDB collection.

    Returns:
        list: List of all feedback documents.
    """
    try:
        feedbacks = list(feedback_collection.find({}, {"_id": 0}))
        return feedbacks
    except Exception as e:
        logging.error(f"Error retrieving feedbacks: {str(e)}")
        return {"error": "Error retrieving feedbacks."}
