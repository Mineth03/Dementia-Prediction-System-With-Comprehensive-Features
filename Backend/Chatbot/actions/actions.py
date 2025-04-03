import pymongo
from rasa_sdk import Action
import logging
import json
from fuzzywuzzy import process

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

        # Send corrected message to Rasa NLU
        return [tracker.update_latest_message({"text": corrected_text})]

class ActionListWeeklyReports(Action):
    def name(self):
        return "action_list_weekly_reports"

    def run(self, dispatcher, tracker, domain):
        client = None
        try:
            username = tracker.sender_id
            logging.info(f"Fetching reports for username: {username}")

            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            db = client[DATABASE_NAME]
            collection = db[COLLECTION_NAME]

            matching_reports = list(collection.find({"username": username}))
            logging.info(f"Found {len(matching_reports)} report(s): {matching_reports}")

            reports = sorted(
                matching_reports,
                key=lambda r: r.get("timestamp", 0),
                reverse=True
            )[:5]

            report_list = []
            for report in reports:
                if "timestamp" in report and "url" in report:
                    report_list.append({
                    "date": report["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                    "url": report["url"]
                })

            if not report_list:
                dispatcher.utter_message(json.dumps({"message": "No reports found for your account."}))
            else:
                dispatcher.utter_message(json.dumps({
                    "message": "Here are your latest weekly reports:",
                    "reports": report_list
                }))

        except pymongo.errors.ServerSelectionTimeoutError:
            dispatcher.utter_message(json.dumps({"error": "Database connection issue."}))
        except Exception as e:
            dispatcher.utter_message(json.dumps({"error": "Error fetching reports."}))
            logging.error(f"Error retrieving reports: {e}")
        finally:
            if client:
                client.close()

        return []


