# tracking.py
from flask import jsonify
from pymongo import MongoClient
import logging
import urllib
from datetime import datetime, timedelta
import os
import base64

# -----------------------
# MongoDB Configuration
# -----------------------
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client["SafeMind"]
patients_collection = db["tracker"]
tasks_collection = db["tasks"]
sleep_collection = db["sleep"]
info_collection = db["user_credentiels"]
report_collection = db["report"]

# Enable Logging
logging.basicConfig(level=logging.INFO)

# -----------------------
# MongoDB Connection Check
# -----------------------
def check_mongo_connection():
    try:
        client.server_info()  # Ping the database
        return jsonify({"success": True, "message": "MongoDB connection successful"}), 200
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {str(e)}")
        return jsonify({"success": False, "error": "MongoDB connection failed"}), 500


# -----------------------
# Patient Management
# -----------------------

# Register a patient
def register_patient(request):
    try:
        data = request.json
        patient_data = {
            "username": data.get("username"),
            "stage_of_dementia": data.get("stage_of_dementia"),
            "recommended_sleeping_hours": data.get("recommended_sleeping_hours"),
            "precautions": data.get("precautions"),
            "medications": data.get("medications"),
            "daily_routines": data.get("daily_routines"),
        }

        result = patients_collection.insert_one(patient_data)
        if result.inserted_id:
            logging.info("Patient registered successfully.")
            return jsonify({"success": True, "message": "Patient registered successfully."}), 201
        else:
            return jsonify({"success": False, "error": "Failed to register patient."}), 500
    except Exception as e:
        logging.error(f"Error registering patient: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# Get all patients
def get_all_patients():
    try:
        patients = list(patients_collection.find({}, {"_id": 0}))
        return jsonify({"success": True, "data": patients}), 200
    except Exception as e:
        logging.error(f"Error retrieving patient data: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# Get patient by username
def get_patient_by_username(username):
    try:
        patient = patients_collection.find_one({"username": username}, {"_id": 0})
        if patient:
            return jsonify({"success": True, "data": patient}), 200
        else:
            return jsonify({"success": False, "error": "Patient not found."}), 404
    except Exception as e:
        logging.error(f"Error retrieving patient data for {username}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# Update patient data
def update_patient(request, username):
    try:
        data = request.json
        update_data = {
            "stage_of_dementia": data.get("stage_of_dementia"),
            "recommended_sleeping_hours": data.get("recommended_sleeping_hours"),
            "precautions": data.get("precautions"),
            "medications": data.get("medications"),
            "daily_routines": data.get("daily_routines"),
        }

        result = patients_collection.update_one({"username": username}, {"$set": update_data})
        if result.matched_count > 0:
            logging.info(f"Patient data updated for {username}.")
            return jsonify({"success": True, "message": "Patient data updated successfully."}), 200
        else:
            return jsonify({"success": False, "error": "Patient not found."}), 404
    except Exception as e:
        logging.error(f"Error updating patient data for {username}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# Delete patient
def delete_patient(username):
    try:
        result = patients_collection.delete_one({"username": username})
        if result.deleted_count > 0:
            logging.info(f"Patient data deleted for {username}.")
            return jsonify({"success": True, "message": "Patient data deleted successfully."}), 200
        else:
            return jsonify({"success": False, "error": "Patient not found."}), 404
    except Exception as e:
        logging.error(f"Error deleting patient data for {username}: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------
# Task and Routine Management
# -----------------------------

# Log Task Completion (Done/Skip)
def log_task(request):
    try:
        data = request.json
        task_log = {
            "username": data["username"],
            "task_name": data["task_name"],
            "task_type": data["task_type"],
            "action": data["action"],
            "timestamp": datetime.strptime(data["timestamp"], "%Y-%m-%dT%H:%M:%S.%fZ"),
        }
        tasks_collection.insert_one(task_log)
        logging.info("Task logged successfully for user: %s", data["username"])
        return jsonify({"success": True, "message": "Task logged successfully."}), 201
    except Exception as e:
        logging.error(f"Error logging task: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------
# Sleep Tracking
# -----------------------------

# Log Daily Sleep Data
def log_sleep(request):
    try:
        data = request.json
        sleep_log = {
            "username": data["username"],
            "date": datetime.strptime(data["date"], "%Y-%m-%d"),
            "hours_slept": float(data["hours_slept"]),
        }
        # Check if record already exists for the same date, then update
        sleep_collection.update_one(
            {"username": data["username"], "date": sleep_log["date"]},
            {"$set": sleep_log},
            upsert=True,
        )
        logging.info("Sleep data logged successfully for user: %s", data["username"])
        return jsonify({"success": True, "message": "Sleep data logged successfully."}), 201
    except Exception as e:
        logging.error(f"Error logging sleep data: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------
# Weekly Report Generation
# -----------------------------

# Generate Weekly Report
def generate_weekly_report(username):
    try:
        # Date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

        # Fetch patient plan
        patient = patients_collection.find_one({"username": username})
        if not patient:
            return jsonify({"success": False, "error": "Patient not found"}), 404

        all_medications = [m["medication_name"] for m in patient.get("medications", [])]
        all_routines = [r["routine_name"] for r in patient.get("daily_routines", [])]

        # Fetch logs
        task_logs = tasks_collection.find({
            "username": username,
            "timestamp": {"$gte": start_date, "$lt": end_date},
        })

        medication_summary = {"done": 0, "skipped": 0}
        routine_summary = {"done": 0, "skipped": 0}
        completed_meds = set()
        completed_routines = set()

        for log in task_logs:
            if log["task_type"] == "medication":
                if log["action"] == "done":
                    medication_summary["done"] += 1
                    completed_meds.add(log["task_name"])
                elif log["action"] == "skip":
                    medication_summary["skipped"] += 1
            elif log["task_type"] == "routine":
                if log["action"] == "done":
                    routine_summary["done"] += 1
                    completed_routines.add(log["task_name"])
                elif log["action"] == "skip":
                    routine_summary["skipped"] += 1

        missing_meds = list(set(all_medications) - completed_meds)
        missing_routines = list(set(all_routines) - completed_routines)

        # Sleep data
        sleep_logs = sleep_collection.find({
            "username": username,
            "date": {"$gte": start_date, "$lt": end_date},
        })
        sleep_data = [
            {"date": log["date"].strftime("%Y-%m-%d"), "hours": log["hours_slept"]}
            for log in sleep_logs
        ]

        # Return full report
        report_data = {
            "success": True,
            "report": {
                "medicationTaskCompletionChart": {
                    "labels": ["Medications Done", "Medications Skipped"],
                    "datasets": [{
                        "data": [medication_summary["done"], medication_summary["skipped"]],
                        "backgroundColor": ["#4CAF50", "#FF6347"],
                    }],
                },
                "routineTaskCompletionChart": {
                    "labels": ["Routines Done", "Routines Skipped"],
                    "datasets": [{
                        "data": [routine_summary["done"], routine_summary["skipped"]],
                        "backgroundColor": ["#4CAF50", "#FF6347"],
                    }],
                },
                "sleepChart": {
                    "labels": [entry["date"] for entry in sleep_data],
                    "datasets": [{
                        "label": "Hours Slept",
                        "data": [entry["hours"] for entry in sleep_data],
                        "backgroundColor": "#36A2EB",
                    }],
                },
                "completedMedications": list(completed_meds),
                "completedRoutines": list(completed_routines),
                "missingMedications": missing_meds,
                "missingRoutines": missing_routines
            },
        }

        logging.info("Weekly report generated for user: %s", username)
        return jsonify(report_data), 200

    except Exception as e:
        logging.error(f"Error generating weekly report: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------
# Check if User Exists
# -----------------------------
def check_user_in_tracker(username):
    try:
        patient = patients_collection.find_one({"username": username}, {"_id": 0})
        if patient:
            return jsonify({"exists": True, "data": patient}), 200
        else:
            return jsonify({"exists": False, "message": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error checking user: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


def save_report_image(username, image_data):
    if not username or not image_data:
        return {"success": False, "error": "Missing username or image data"}

    try:
        # Decode and save image
        image_bytes = base64.b64decode(image_data.split(",")[1])
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{username}_{timestamp}.png"
        filepath = os.path.join("saved_reports", filename)

        os.makedirs("saved_reports", exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(image_bytes)

        # Store info in MongoDB
        report_collection.insert_one({
            "username": username,
            "timestamp": datetime.now(),
            "filename": filename,
            "url": f"http://localhost:5000/reports/{filename}"
        })

        return {"success": True, "url": f"http://localhost:5000/reports/{filename}"}

    except Exception as e:
        return {"success": False, "error": str(e)}