# main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from pymongo import MongoClient  # ADDED FOR DATABASE CONNECTION
import urllib.parse              # IMPORT LIBRARY TO ENCODE SPECIAL CHARACTERS IN PASSWORD

# Import the functions from our modules
from basicdp_functions import predict_basicdp
from facialrec_functions import analyze_face

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "allow_headers": ["Content-Type"], "methods": ["GET", "POST"]}})  # UPDATED THIS LINE
# CORS(app)  COMMENTED THIS OFF CAUSE DUPLICATE ERRORS

logging.basicConfig(level=logging.INFO)

# ---------------CONNECT TO MONGODB------------------

# STORE PASSWORD WITH SPECIAL CHARACTERS CAUSE OF DB ERRORS
password = "12345678@mineth"
encoded_password = urllib.parse.quote_plus(password)    # ENCODE PASSWORD TO MAKE IT URL-SAFE

# FORMAT MONGODB ATLAS CONNECTION STRING WITH ENCODED PASSWORD
mongo_uri = f"mongodb+srv://admin:{encoded_password}@cluster0.s0ovw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)                         # CONNECT TO MONGODB ATLAS
db = client["SafeMind"]
users_collection = db["user_credentiels"]
#---------------------------------------------------------

# USER REGISTRATION ENDPOINT
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # ✅ STORE ALL USER DETAILS
    full_name = data.get("fullName")
    gender = data.get("gender")
    age = data.get("age")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # ✅ CHECK IF EMAIL ALREADY EXISTS
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email is already registered"}), 400

    # ✅ CHECK IF PHONE NUMBER ALREADY EXISTS
    if users_collection.find_one({"phone": phone}):
        return jsonify({"error": "Phone number is already registered"}), 400

    # ✅ INSERT FULL USER DETAILS INTO DATABASE
    users_collection.insert_one({
        "fullName": full_name,
        "gender": gender,
        "age": age,
        "email": email,
        "phone": phone,
        "password": password
    })

    response = jsonify({"message": "User registered successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")  # ✅ ADD CORS HEADER
    return response, 201

# USER LOGIN ENDPOINT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # ✅ FIND USER BASED ON EMAIL & PASSWORD
    user = users_collection.find_one({"email": email, "password": password})

    if user:
        # ✅ EXTRACT USER DETAILS (EXCLUDING OBJECT ID & PASSWORD)
        user_data = {
            "fullName": user.get("fullName"),
            "gender": user.get("gender"),
            "age": user.get("age"),
            "email": user.get("email"),
            "phone": user.get("phone"),
        }

        response = jsonify({"message": "Login successful", "user": user_data})
        response.headers.add("Access-Control-Allow-Origin", "*")  # ✅ ADD CORS HEADER
        return response, 200
    else:
        response = jsonify({"error": "Invalid credentials"})
        response.headers.add("Access-Control-Allow-Origin", "*")  # ✅ ADD CORS HEADER
        return response, 401

# Endpoint for the basic depression prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    result = predict_basicdp(data)
    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")  # ✅ ADD CORS HEADER
    return response

# Endpoint for facial analysis
@app.route('/faceAnalysis', methods=['POST'])
def face_analysis():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    file = request.files['image']
    result = analyze_face(file)
    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")  # ✅ ADD CORS HEADER
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
