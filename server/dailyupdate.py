from datetime import datetime, timedelta
import schedule  # You can use 'schedule' library to manage tasks
import time

# Patient daily schedule (from database or input during registration)
#dummy for test
patient_schedule = {
    "medications": [
        {"name": "Donepezil", "time": "09:00 AM"},
        {"name": "Memantine", "time": "01:00 PM"}
    ],
    "activities": [
        {"name": "Morning Walk", "time": "07:00 AM"},
        {"name": "Brain Activity", "time": "04:00 PM"}
    ]
}

# Function to generate a daily form for a user
def generate_daily_form(user_id, user_schedule):
    print(f"Generating daily form for user: {user_id}")
    daily_form = {
        "medications": user_schedule["medications"],
        "activities": user_schedule["activities"]
    }
    # Send form to the user (via frontend, email, etc.)
    print(f"Form for {user_id}: {daily_form}")

# Loop through each user's schedule and set up the task scheduler
def schedule_daily_forms(user_schedules):
    for user_id, schedule_data in user_schedules.items():
        # Schedule forms for medications
        for med in schedule_data["medications"]:
            schedule.every().day.at(med["time"]).do(generate_daily_form, user_id, schedule_data)
        # Schedule forms for activities
        for activity in schedule_data["activities"]:
            schedule.every().day.at(activity["time"]).do(generate_daily_form, user_id, schedule_data)

# Example: Load user schedules from database and start scheduling forms
schedule_daily_forms(user_schedule)

# Keep the scheduler running
while True:
    schedule.run_pending()
    time.sleep(1)