# 🧠 Cognitive Health Assessment App

A futuristic and interactive web-based platform that provides:
- 🧬 **Dementia Early Detection** (based on non-meical factors)
- 🧬 **Dementia Sevierity Prediction** (based on medical factors),
- 🧪 **Depression Test** (via facial emotion analysis),
- 🧮 **Cognitive Assessment** (based on MoCA test),
- 🧮 **Patient Tracking System** (based medications and daily routine),
- 💬 **Chatbot Assistant** for mental health support and guidance.

Built with **ReactJS + Tailwind CSS** on the frontend and **Flask + Machine Learning models + Rasa** on the backend.

---

## 🌟 Features
- 📊 Early Diagnosis
- 📊 Risk prediction based on user profile and test results
- 📷 Facial depression analysis using webcam and a pre-trained Vision Transformer model
- 🧠 Interactive Montreal Cognitive Assessment (MoCA) style cognitive test
- 🧮 Patient tracking system with reminders
- 💬 Rasa-powered chatbot for health education and help
- 🧠 Brain Games to interact
- 🎨 Clean, accessible, and responsive UI

---

## 🧰 Tech Stack

| Frontend         | Backend (API)    | Chatbot (NLP)   | ML/AI Models         |
|------------------|------------------|------------------|----------------------|
| React + Vite     | Flask (Python)   | Rasa (Python)    | Scikit-learn, TensorFlow |
| Tailwind CSS     | Flask-CORS       | Rasa SDK         | Vision Transformer (Facial Analysis) |

---

## 🛠️ Setup Instructions

### ⚙️ Backend Setup (Flask)

1. **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2. **Create and activate a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install required dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Start the Flask server**:
    ```bash
    python main.py
    ```

> ⚠️ Ensure `Models/FaceRec.h5` and `Models/BasicDP.pkl` exist in the `Models` folder.

---

### 🌐 Frontend Setup (React)

1. **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install node dependencies**:
    ```bash
    npm install
    ```

3. **Run the React development server**:
    ```bash
    npm run dev
    ```

> React app runs at: `http://localhost:5173`  
> Flask API runs at: `http://localhost:5000`

---

### 💬 Chatbot Setup (Rasa)

1. **Navigate to chatbot directory**:
    ```bash
    cd chatbot
    ```

2. **Create and activate a virtual environment (if not already active)**:
    ```bash
    python -m venv chatbot_env
    source venv/bin/activate
    ```

3. **Install Rasa and SDK**:
    ```bash
    pip install rasa rasa-sdk
    ```

4. **Train the chatbot**:
    ```bash
    rasa train
    ```

5. **Start Rasa Action Server** (in new terminal):
    ```bash
    rasa run actions
    ```

6. **Start Rasa Server**:
    ```bash
    rasa run --enable-api --cors "*" --debug
    ```

> Rasa chatbot runs at: `http://localhost:5005`

---

## 📦 Requirements

### Python Backend (`requirements.txt`)
### Download and put three models inside the Models file (link is provided in a txt file.)

## 🛠️ Run the system

### Can easily run the system by run the .bat file.
