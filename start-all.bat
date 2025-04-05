@echo off

:: --- Start Frontend (React / Vite)
start cmd /k "cd Frontend && npm run dev"

:: --- Start Flask Backend
start cmd /k "cd Backend && python main.py"

:: --- Start Rasa Server with chatbot_env activated
start cmd /k "cd Backend\Chatbot && call chatbot_env\Scripts\activate && rasa run --enable-api --cors "*" --debug"

:: --- Start Rasa Actions Server with chatbot_env activated
start cmd /k "cd Backend\Chatbot && call chatbot_env\Scripts\activate && rasa run actions"

echo All servers launched in separate terminals!

