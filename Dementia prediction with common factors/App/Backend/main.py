from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from basicdp_functions import predict_basicdp
from facialrec_functions import analyze_face
from register import register_user
from login import login_user

# Initialize Flask App
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configure Logging
logging.basicConfig(level=logging.INFO)

# User Registration Endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        return register_user()
    except Exception as e:
        logging.error(f"Error in registration: {str(e)}")
        return jsonify({"error": "Server error during registration"}), 500

# User Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        return login_user()
    except Exception as e:
        logging.error(f"Error in login: {str(e)}")
        return jsonify({"error": "Server error during login"}), 500

# Endpoint for the basic depression prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        result = predict_basicdp(data)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in prediction: {str(e)}")
        return jsonify({"error": "Server error during prediction"}), 500

# Endpoint for facial analysis
@app.route('/faceAnalysis', methods=['POST'])
def face_analysis():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        file = request.files['image']
        result = analyze_face(file)
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in face analysis: {str(e)}")
        return jsonify({"error": "Server error during face analysis"}), 500

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
