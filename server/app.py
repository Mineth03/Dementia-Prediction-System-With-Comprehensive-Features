from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)  # Allow frontend to access the API

# MongoDB Connection
MONGO_URI = "your_mongodb_atlas_connection_string"
client = MongoClient(MONGO_URI)
db = client["dementia_tracking"]  # Database name
patients_collection = db["patients"]  # Collection for storing patient data

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask MongoDB Backend is Running!"})

if __name__ == "__main__":
    app.run(debug=True)

socketio = SocketIO(app)
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)