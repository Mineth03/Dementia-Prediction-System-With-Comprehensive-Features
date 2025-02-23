import pymongo
from rasa_sdk import Action
from rasa_sdk.events import SlotSet
import logging

MONGO_URI = "mongodb+srv://admin:12345678%40mineth@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "SafeMind"
COLLECTION_NAME = "report"

class ActionTestMongoConnection(Action):
    def name(self):
        return "action_test_mongo_connection"

    def run(self, dispatcher, tracker, domain):
        logging.debug("🚀 Starting action_test_mongo_connection...")
        try:
            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            dispatcher.utter_message("✅ Successfully connected to MongoDB!")
            logging.debug("✅ MongoDB connection successful.")
        except pymongo.errors.ServerSelectionTimeoutError:
            dispatcher.utter_message("❌ Could not connect to MongoDB. Connection timed out.")
            logging.error("❌ MongoDB connection timed out.")
        except Exception as e:
            dispatcher.utter_message(f"❌ Connection failed: {e}")
            logging.error(f"❌ Connection failed: {e}")
        finally:
            client.close()
            logging.debug("🚪 MongoDB connection closed.")
        return []
