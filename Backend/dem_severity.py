import pandas as pd
import joblib
from flask import request, jsonify
import logging

# Load the severity prediction model
model_path = "./Models/dem_sev_model.pkl"
try:
    model = joblib.load(model_path)
    logging.info("Severity model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading severity model: {e}")
    model = None  # Allow app to continue running

def predict_sev():
    try:
        data = request.json  # Get JSON data from React
        df = pd.DataFrame([data])
        df = df.astype(float)
        prediction = model.predict(df)[0]
        return jsonify({"risk_level": str(prediction)})
    except Exception as e:
        logging.error(f"Error in severity prediction: {str(e)}")
        return jsonify({"error": str(e)})
