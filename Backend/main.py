# main.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import logging
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

# Importing functions from other modules
from basicdp_functions import predict_basicdp
from facialrec_functions import analyze_face
from register import register_user
from login import login_user
from dem_severity import predict_sev
from email_utils import send_email
from feedback import save_feedback, get_all_feedbacks
from profile import update_user_profile
from reminder_scheduler import start_scheduler
from tracking import (
    check_user_in_tracker,
    check_mongo_connection,
    register_patient,
    get_all_patients,
    get_patient_by_username,
    update_patient,
    delete_patient,
    log_task,
    log_sleep,
    generate_weekly_report,
    save_report_image 
)

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

@app.route('/check-mongo')
def home_mongo():
    return check_mongo_connection()


@app.route('/register-patient', methods=['POST'])
def handle_register_patient():
    return register_patient(request)


@app.route('/get-patients', methods=['GET'])
def handle_get_patients():
    return get_all_patients()


@app.route('/get-patient/<username>', methods=['GET'])
def handle_get_patient(username):
    return get_patient_by_username(username)


@app.route('/update-patient/<username>', methods=['PUT'])
def handle_update_patient(username):
    return update_patient(request, username)


@app.route('/delete-patient/<username>', methods=['DELETE'])
def handle_delete_patient(username):
    return delete_patient(username)


@app.route('/check-tracker/<username>', methods=['GET'])
def handle_check_tracker(username):
    return check_user_in_tracker(username)

@app.route('/api/user/update', methods=['PUT'])
def update_user():
    data = request.get_json()
    result = update_user_profile(data)
    return jsonify(result), 200 if result.get("success") else 404

@app.route('/register', methods=['POST'])
def handle_register():
    try:
        return register_user()
    except Exception as e:
        logging.error(f"Error in registration: {str(e)}")
        return jsonify({"error": "Server error during registration"}), 500

@app.route('/login', methods=['POST'])
def handle_login():
    try:
        return login_user()
    except Exception as e:
        logging.error(f"Error in login: {str(e)}")
        return jsonify({"error": "Server error during login"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("[INFO] Incoming prediction request with data:")
    print(data)

    # Translate frontend keys to expected model input
    translated = {
        "SEX": data.get("Sex"),
        "NACCAGEB": data.get("Age"),
        "EDUC": data.get("EducationYears"),
        "MARISTAT": data.get("MaritalStatus"),
        "ALCFREQ": data.get("AlcoholFrequency"),
        "TOBAC100": data.get("SmokingStatus"),
        "SMOKYRS": data.get("SmokingYears"),
        "NACCBMI": data.get("BMI"),
        "Depression": data.get("DepressionStatus"),
        "SLEEPAP": ",".join(data.get("SleepingProblems", [])) if isinstance(data.get("SleepingProblems"), list) else data.get("SleepingProblems", ""),
        "DIABETES": data.get("Diabetes"),
        "HYPERCHO": data.get("Cholesterol"),
        "HYPERTEN": data.get("BloodPressure"),
        "CVHATT": data.get("HeartAttack"),
        "CVCHF": data.get("HeartFailure"),
        "NACCFAM": data.get("FamilyHistory"),
        "COGTEST": data.get("CognitiveTestScore")
    }

    result = predict_basicdp(translated)
    print("[INFO] Prediction result:", result)
    return jsonify(result)

@app.route('/predict_sev', methods=['POST'])
def handle_predict_severity():
    return predict_sev()

@app.route('/faceAnalysis', methods=['POST'])
def handle_face_analysis():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        file = request.files['image']
        result = analyze_face(file)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in face analysis: {str(e)}")
        return jsonify({"error": "Server error during face analysis"}), 500

@app.route('/log-task', methods=['POST'])
def handle_log_task():
    try:
        return log_task(request)
    except Exception as e:
        logging.error(f"Error logging task: {str(e)}")
        return jsonify({"error": "Server error while logging task"}), 500

@app.route('/log-sleep', methods=['POST'])
def handle_log_sleep():
    try:
        return log_sleep(request)
    except Exception as e:
        logging.error(f"Error logging sleep: {str(e)}")
        return jsonify({"error": "Server error while logging sleep"}), 500

@app.route('/generate-report', methods=['GET'])
def handle_generate_report():
    try:
        username = request.args.get("username")
        return generate_weekly_report(username)
    except Exception as e:
        logging.error(f"Error generating report: {str(e)}")
        return jsonify({"error": "Server error while generating report"}), 500
    

# Save report image endpoint
@app.route('/save-report-image', methods=['POST'])
def save_report_image_route():
    data = request.get_json()
    username = data.get("username")
    image_data = data.get("imageData")
    result = save_report_image(username, image_data)
    return jsonify(result)

# Serve static image
@app.route('/reports/<filename>')
def get_report_image(filename):
    return send_from_directory("saved_reports", filename)


@app.route('/submitFeedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        feedback = data.get('feedback', '').strip()
        result = save_feedback(feedback)
        if "error" in result:
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error submitting feedback: {str(e)}")
        return jsonify({"error": "Server error while submitting feedback"}), 500

@app.route('/getFeedbacks', methods=['GET'])
def get_feedbacks():
    try:
        result = get_all_feedbacks()
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error retrieving feedbacks: {str(e)}")
        return jsonify({"error": "Server error while fetching feedbacks"}), 500


# -----------------------------
# Chatbot (Rasa Integration) Route
# -----------------------------
@app.route('/chat', methods=['POST'])
def handle_chatbot():
    try:
        data = request.get_json()
        user_message = data.get("message")
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        rasa_url = "http://localhost:5005/webhooks/rest/webhook"
        rasa_response = requests.post(rasa_url, json={"sender": "user", "message": user_message})
        response_data = rasa_response.json()
        bot_response = response_data[0]["text"] if response_data else "Sorry, I didn't understand that."

        return jsonify({"response": bot_response})
    except Exception as e:
        logging.error(f"Error in chatbot communication: {str(e)}")
        return jsonify({"error": "Server error during chatbot interaction"}), 500

# -----------------------------
# Main Route
# -----------------------------
@app.route('/')
def home():
    return jsonify({"message": "SafeMind API Service is Running!"})


# -----------------------------
# Run Flask Application
# -----------------------------
if __name__ == '__main__':
    start_scheduler()
    app.run(debug=True, host='0.0.0.0', port=5000)
