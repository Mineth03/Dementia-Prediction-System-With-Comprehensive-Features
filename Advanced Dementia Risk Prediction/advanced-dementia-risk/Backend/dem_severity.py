import pandas as pd
from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS  # Allows frontend to communicate with backend

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load the saved model
model = joblib.load("dem_sev_model.pkl")

@app.route('/predict_sev', methods=['POST'])
def predict_sev():
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
