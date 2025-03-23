from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import os

app = Flask(__name__)

# MongoDB Atlas URI (Atlas connection URI)

app.config["MONGO_URI"] = "mongodb+srv://admin:12345678%40mineth@cluster0.s0ovw.mongodb.net/safeMind?retryWrites=true&w=majority&appName=Cluster0"

# Initialize PyMongo
mongo = PyMongo(app)

# Collections
patients = mongo.db.daily_routine

# Route for the root URL (to avoid 404)
@app.route('/')
def home():
    try:
        # Try accessing a collection to check if the connection works
        mongo.db.list_collection_names()  # This will check if collections can be listed
        return "MongoDB Connection Successful!"
    except Exception as e:
        return f"Error connecting to MongoDB: {str(e)}"

# Route to handle patient registration
@app.route('/register-patient', methods=['POST'])
def register_patient():
    # Get data from the request
    data = request.get_json()

    # Validate input
    if not data.get('email') or not data.get('age'):
        return jsonify({'error': 'Email and age are required fields!'}), 400

    # Construct patient data to insert
    patient_data = {
        "name": data['name'],
        "email": data['email'],
        "phone": data['phone'],
        "age": data['age'],
        "stage_of_dementia": data['stage_of_dementia'],
        "precautions": data['precautions'],
        "recommended_sleeping_hours": data['recommended_sleeping_hours'],
        "medications": data.get('medications', []),  # Medications array
        "daily_routines": data.get('daily_routines', [])  # Daily routines array
    }

    # Insert patient data into MongoDB
    result = patients.insert_one(patient_data)

    # Return success response with patient ID
    return jsonify({'message': 'Patient registered successfully!', 'patient_id': str(result.inserted_id)}), 201

if __name__ == '__main__':
    app.run(debug=True)
