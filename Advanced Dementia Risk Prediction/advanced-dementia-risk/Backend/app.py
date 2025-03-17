from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the trained Random Forest model
model_path = os.path.join(os.path.dirname(__file__), "rf_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  # Get JSON data from React

        # Convert form data into DataFrame
        df = pd.DataFrame([data])

        # Ensure data matches model's training format (modify if needed)
        df = df.astype(float)  

        # Predict risk level
        prediction = model.predict(df)[0]

        # Return the prediction as JSON
        return jsonify({"risk_level": str(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
