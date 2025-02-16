import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import numpy as np
from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image

# Initialize Flask app
app = Flask(__name__)

# Load the pretrained model
model_path = '../Models/FaceRec.h5'
model = load_model(model_path)

# Load OpenCV's pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Define emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Depression weight mapping
depression_weights = {
    'Angry': 0.2,
    'Fear': 0.3,
    'Sad': 0.5,
    'Happy': -0.4,
    'Surprise': -0.1,
    'Disgust': 0.0,
    'Neutral': 0.0
}


# Function to detect faces in an image
def detect_face(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return None, "Error: No face detected in the image."

    return gray, None


# Function to preprocess the input image
def preprocess_image(image):
    image = cv2.resize(image, (48, 48))  # Resize to model's input shape
    image = image / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = np.expand_dims(image, axis=-1)  # Add channel dimension
    return image


# Function to calculate depression risk score
def calculate_depression_risk(predictions):
    drs = sum(depression_weights[label] * score for label, score in zip(emotion_labels, predictions))
    drs = max(0, min(drs, 1))  # Ensure value is between 0 and 1

    # Classify depression risk
    if drs < 0.3:
        risk_level = "Low Depression Risk"
    elif drs < 0.6:
        risk_level = "Moderate Depression Risk"
    else:
        risk_level = "High Depression Risk"

    return drs, risk_level


# API route to handle image processing
@app.route('/faceAnalysis', methods=['POST'])
def face_analysis():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']

    # Convert the uploaded image to a format that OpenCV can use
    image = Image.open(BytesIO(file.read()))
    image = np.array(image)

    # Detect face and process image
    gray_image, error_msg = detect_face(image)
    if error_msg:
        return jsonify({'error': error_msg}), 400

    processed_image = preprocess_image(gray_image)
    predictions = model.predict(processed_image)[0]  # Get prediction scores

    # Compute depression risk score and category
    depression_score, risk_category = calculate_depression_risk(predictions)

    # Return the result as a JSON response
    result = {
        'score': depression_score,
        'category': risk_category
    }

    return jsonify(result)


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
