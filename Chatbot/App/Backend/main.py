# main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Import the functions from our modules
from basicdp_functions import predict_basicdp
from facialrec_functions import analyze_face

app = Flask(__name__)
# Enable CORS as needed (adjust origins as required)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})
CORS(app)  # Enable for all routes

logging.basicConfig(level=logging.INFO)

# Endpoint for the basic depression prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    result = predict_basicdp(data)
    return jsonify(result)

# Endpoint for facial analysis
@app.route('/faceAnalysis', methods=['POST'])
def face_analysis():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    file = request.files['image']
    result = analyze_face(file)
    return jsonify(result)

if __name__ == '__main__':
    # Running on host '0.0.0.0' and port 5000 so it can be accessible on the network.
    app.run(debug=True, host='0.0.0.0', port=5000)
