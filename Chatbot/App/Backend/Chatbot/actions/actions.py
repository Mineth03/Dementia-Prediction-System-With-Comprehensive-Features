import pymongo
from rasa_sdk import Action
import logging
import json  # NEW: IMPORT JSON TO SEND STRUCTURED DATA
from fuzzywuzzy import process # NEW

# MONGODB'S CONNECTION DETAILS
MONGO_URI = "mongodb+srv://admin:12345678%40mineth@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "SafeMind"
COLLECTION_NAME = "report"

# DEFINE KNOWN WORDS FOR CORRECTION
KNOWN_WORDS = [
    "dementia", "symptoms", "treatment", "caregiver", "support",
    "alzheimer", "memory", "decline", "brain", "therapy", "assistance",
    "diagnosis", "prevention", "medication", "aggression", "paranoia",
    "wandering", "nutrition", "exercise", "stress", "hallucinations"
]

class ActionCorrectSpelling(Action):
    def name(self):
        return "action_correct_spelling"

    def correct_spelling(self, text):
        """Corrects spelling using fuzzy matching"""
        words = text.split()
        corrected_words = [
            process.extractOne(word, KNOWN_WORDS)[0] if word not in KNOWN_WORDS else word
            for word in words
        ]
        return " ".join(corrected_words)

    def run(self, dispatcher, tracker, domain):
        """Intercepts user messages, corrects spelling, and sends corrected text back"""
        user_input = tracker.latest_message.get("text")
        corrected_text = self.correct_spelling(user_input)

        logging.debug(f"🔍 Original: {user_input} | ✅ Corrected: {corrected_text}") # YOU CAN REMOVE THIS IF U WANT

        # Send corrected message to Rasa NLU
        return [tracker.update_latest_message({"text": corrected_text})]

class ActionListWeeklyReports(Action):
    def name(self):
        return "action_list_weekly_reports"

    def run(self, dispatcher, tracker, domain):
        logging.debug("Fetching weekly reports from MongoDB...")

        try:
            # NEW: CONNECT TO MONGODB
            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            db = client[DATABASE_NAME]
            collection = db[COLLECTION_NAME]

            # NEW: FETCH ALL REPORTS, SORTED BY DATE (NEWEST FIRST)
            reports = collection.find().sort("date", -1)

            report_list = []
            for report in reports:
                if "date" in report and "report_url" in report:
                    report_list.append({
                        "date": report["date"],  # NEW: STORE DATE
                        "url": report["report_url"]  # NEW: STORE URL
                    })

            if not report_list:
                response_data = {"message": "No reports are available at the moment."}
            else:
                response_data = {
                    "message": "Here are your available weekly reports:",
                    "reports": report_list  # NEW: SEND REPORTS AS JSON
                }

            dispatcher.utter_message(json.dumps(response_data))  # NEW: SEND STRUCTURED JSON RESPONSE
            logging.debug("Reports successfully fetched and sent.")

        except pymongo.errors.ServerSelectionTimeoutError:
            dispatcher.utter_message(json.dumps({"error": "Database connection issue. Try again later."}))
            logging.error("MongoDB connection timed out.")
        except Exception as e:
            dispatcher.utter_message(json.dumps({"error": "Error fetching reports. Try again later."}))
            logging.error(f"Error retrieving reports: {e}")
        finally:
            client.close()
            logging.debug("MongoDB connection closed.")
        return []
