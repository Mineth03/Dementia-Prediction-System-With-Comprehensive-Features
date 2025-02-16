from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

# Define categorical mappings
CATEGORY_MAPPINGS = {
    "SEX": {"Male": 1, "Female": 2},
    "MARISTAT": {"Married": 1, "Widowed": 2, "Divorced": 3, "Separated": 4, "Never married": 5},
    "ALCFREQ": {"Less than once a month": 0, "About once a month": 1, "About once a week": 2, "A few times a week": 3, "Daily or almost daily": 4},
    "TOBAC100": {"No": 0, "Yes": 1},
    "Depression": {"No": 0, "Yes": 1},
    "DIABETES": {"No": 0, "Yes": 1, "Unknown": -1},
    "HYPERCHO": {"No": 0, "Yes": 1, "Unknown": -1},
    "HYPERTEN": {"No": 0, "Yes": 1, "Unknown": -1},
    "CVHATT": {"No": 0, "Yes": 1, "Unknown": -1},
    "CVCHF": {"No": 0, "Yes": 1, "Unknown": -1},
    "NACCFAM": {"No": 0, "Yes": 1, "Unknown": -1}
}

# Load the trained model
def load_model():
    model_path = "../Models/BasicDP.pkl"
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")


model = load_model()  # Load model at startup

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # Receive JSON data from frontend

        # Define expected features order
        features = [
            "SEX", "NACCAGEB", "EDUC", "MARISTAT", "ALCFREQ", "TOBAC100", "SMOKYRS",
            "NACCBMI", "Depression", "SLEEPAP", "DIABETES", "HYPERCHO", "HYPERTEN", 
            "CVHATT", "CVCHF", "NACCFAM", "COGTEST"
        ]

        user_input = []
        for feature in features:
            value = data.get(feature)

            if feature in CATEGORY_MAPPINGS:
                user_input.append(CATEGORY_MAPPINGS[feature].get(value, -1))  # Convert categorical values
            elif isinstance(value, str) and feature == "SLEEPAP":
                sleepap_list = value.split(",")  # Convert sleep problems to numeric indicator
                user_input.append(1 if len(sleepap_list) > 5 else 0)
            else:
                try:
                    user_input.append(float(value))  # Convert numeric values
                except ValueError:
                    user_input.append(-1)  # Handle conversion errors

        # Debugging: Print processed input
        print("Processed Input Data:", user_input)

        # Ensure input is reshaped correctly
        input_data = np.array(user_input).reshape(1, -1)

        # Make prediction (use predict_proba if model supports it)
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(input_data)[0][1]  # Probability of positive class
            result = "Positive" if probability >= 0.5 else "Negative"
        else:
            prediction = model.predict(input_data)
            result = "Positive" if prediction[0] >= 0.5 else "Negative"

        return jsonify({"prediction": result})

    except Exception as e:
        print(f"Error during prediction: {e}")
        traceback.print_exc()
        return jsonify({"error": "An error occurred while predicting."})

if __name__ == '__main__':
    app.run(debug=True)
