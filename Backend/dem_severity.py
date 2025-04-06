import pandas as pd
import joblib
from flask import request, jsonify
import logging
import os

# Load the severity prediction model
model_path = "./Models/dem_sev_model.pkl"
if not os.path.exists(model_path):
    logging.error(f"❌ Model file not found at path: {model_path}")
    raise FileNotFoundError(f"Model file not found at path: {model_path}")

try:
    model = joblib.load(model_path)
    logging.info("✅ Severity model loaded successfully.")
except Exception as e:
    logging.error(f"❌ Error loading model: {e}")
    raise e  # Stop the app if the model is broken

def predict_sev():
    try:
        data = request.json  # Get JSON data from React

        # Define categorical mappings
        binary_map = {"Yes": 1, "No": 0, "Male": 1, "Female": 2, "Unknown": -1}
        
        # Normalize categorical values
        cleaned_data = {}
        for k, v in data.items():
            if isinstance(v, str):
                cleaned_data[k] = binary_map.get(v, v)  # map if possible, else keep original
            else:
                cleaned_data[k] = v  # keep as-is if already numeric

        df = pd.DataFrame([cleaned_data])
        df = df.apply(pd.to_numeric, errors='coerce')  # Convert safely, NaN for invalid

        if df.isnull().any().any():
            logging.warning(f"NaNs found in input: {df}")
            return jsonify({"error": "Invalid input values – check categorical fields."})

        prediction = model.predict(df)[0]
        return jsonify({"risk_level": str(prediction)})

    except Exception as e:
        logging.error(f"Error in severity prediction: {str(e)}")
        return jsonify({"error": str(e)})
