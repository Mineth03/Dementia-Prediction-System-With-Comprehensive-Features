# basicdp_functions.py
import numpy as np
import joblib
import os
import traceback

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

def load_model():
    model_path = os.path.join(".", "Models", "BasicDP.pkl")
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")

# Load model once at module import
model = load_model()

def predict_basicdp(data):
    try:
        # Define expected feature order
        features = [
            "SEX", "NACCAGEB", "EDUC", "MARISTAT", "ALCFREQ", "TOBAC100", "SMOKYRS",
            "NACCBMI", "Depression", "SLEEPAP", "DIABETES", "HYPERCHO", "HYPERTEN", 
            "CVHATT", "CVCHF", "NACCFAM", "COGTEST"
        ]

        user_input = []
        for feature in features:
            value = data.get(feature)
            if feature in CATEGORY_MAPPINGS:
                mapped_value = CATEGORY_MAPPINGS[feature].get(value, -1)
                user_input.append(mapped_value)
            elif feature == "SLEEPAP":
                if isinstance(value, str):
                    sleepap_list = value.split(",")
                elif isinstance(value, list):
                    sleepap_list = value
                else:
                    sleepap_list = []
                user_input.append(1 if len(sleepap_list) > 5 else 0)
            else:
                try:
                    user_input.append(float(value))
                except (ValueError, TypeError):
                    user_input.append(-1)

        # Debugging: Print the final input vector
        print("Processed Input Data:", user_input)

        input_data = np.array(user_input).reshape(1, -1)

        # Make prediction
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(input_data)[0][1]
            result = (
                "You have a risk of having dementia. Please involve some medical tests to clarify furthermore."
                if probability >= 0.5
                else "You have low risk of having dementia."
            )
            print(f"Prediction Probability: {probability:.4f} -> {result}")
        else:
            prediction = model.predict(input_data)
            result = (
                "You have a risk of having dementia. Please involve some medical tests to clarify furthermore."
                if prediction[0] >= 0.5
                else "You have low risk of having dementia."
            )
            print(f"Prediction Result: {prediction[0]} -> {result}")

        return {"prediction": result}
    except Exception as e:
        print(f"Error during prediction: {e}")
        traceback.print_exc()
        return {"error": "An error occurred while predicting."}

