# facialrec_functions.py
import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the pretrained model for facial analysis
MODEL_PATH =  "./Models/FaceRec.h5"
try:
    model = load_model(MODEL_PATH)
    logging.info("FaceRec model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading FaceRec model: {e}")
    model = None  # Allow the app to continue running

# Load OpenCV's pre-trained face detection classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Define emotion labels and corresponding depression weights
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
depression_weights = {
    'Angry': 0.2, 'Fear': 0.3, 'Sad': 0.5,
    'Happy': -0.4, 'Surprise': -0.1,
    'Disgust': 0.0, 'Neutral': 0.0
}

def detect_face(image):
    """
    Convert the image to grayscale and detect faces using OpenCV.
    Returns the grayscale image or an error message if no face is found.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces) == 0:
        return None, "No face detected in the image."
    return gray, None

def preprocess_image(image):
    """
    Resize and normalize the grayscale image to the input shape expected by the model.
    """
    image = cv2.resize(image, (48, 48))
    image = image / 255.0
    image = np.expand_dims(image, axis=0)    # Add batch dimension
    image = np.expand_dims(image, axis=-1)   # Add channel dimension
    return image

def calculate_depression_risk(predictions):
    """
    Compute a depression risk score based on the predicted emotion scores.
    Returns the score and a risk category.
    """
    drs = sum(depression_weights[label] * score for label, score in zip(emotion_labels, predictions))
    drs = max(0, min(drs, 1))  # Clamp the value between 0 and 1

    if drs < 0.3:
        risk_level = "Low Depression Risk"
    elif drs < 0.6:
        risk_level = "Moderate Depression Risk"
    else:
        risk_level = "High Depression Risk"

    return drs, risk_level

def analyze_face(file):
    if file is None:
        return {"error": "No image provided"}
    
    try:
        image = Image.open(BytesIO(file.read()))
        image = np.array(image)
        logging.info("Image received and converted successfully.")
    except Exception as e:
        logging.error(f"Error opening image: {str(e)}")
        return {"error": f"Error opening image: {str(e)}"}
    
    # Detect face in the image
    gray_image, error_msg = detect_face(image)
    if error_msg:
        logging.warning(error_msg)
        return {"error": error_msg}
    
    try:
        processed_image = preprocess_image(gray_image)
        predictions = model.predict(processed_image)[0]  # Get prediction scores
        logging.info(f"Model predictions: {predictions}")
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        return {"error": f"Error during prediction: {str(e)}"}
    
    depression_score, risk_category = calculate_depression_risk(predictions)
    logging.info(f"Depression Risk Score: {depression_score}, Category: {risk_category}")
    
    return {
        'score': depression_score,
        'category': risk_category
    }
