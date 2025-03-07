import pymongo
from rasa_sdk import Action
import logging

# MongoDB's connection details
MONGO_URI = "mongodb+srv://admin:12345678%40mineth@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "SafeMind"
COLLECTION_NAME = "report"

class ActionListWeeklyReports(Action):
    def name(self):
        return "action_list_weekly_reports"

    def run(self, dispatcher, tracker, domain):
        logging.debug("Fetching weekly reports from MongoDB...")

        try:
            # connect to MongoDB
            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            db = client[DATABASE_NAME]
            collection = db[COLLECTION_NAME]

            # cetch all reports, sorted by date (newest first)
            reports = collection.find().sort("date", -1)

            report_list = []
            for report in reports:
                if "date" in report and "report_url" in report:
                    formatted_date = report["date"]  # make sure date is stored in "YYYY-MM-DD" format
                    report_link = report["report_url"]
                    report_list.append(f"- {formatted_date} - [View Report]({report_link})")

            if not report_list:
                response = "No reports are available at the moment. Please check back later."
            else:
                response = "Here are your available weekly reports:\n" + "\n".join(report_list)

            dispatcher.utter_message(text=response)
            logging.debug("Reports successfully fetched and displayed.")

        except pymongo.errors.ServerSelectionTimeoutError:
            dispatcher.utter_message(text="I'm having trouble connecting to the database. Please try again later.")
            logging.error("MongoDB connection timed out.")
        except Exception as e:
            dispatcher.utter_message(text="An error occurred while fetching reports. Please try again later.")
            logging.error(f"Error retrieving reports: {e}")
        finally:
            client.close()
            logging.debug("MongoDB connection closed.")
        return []
