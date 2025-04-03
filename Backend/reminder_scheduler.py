from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from email_utils import send_email
from tracking import info_collection, patients_collection  # both collections
import logging

def send_task_reminders():
    now = datetime.now()
    reminder_time = now + timedelta(minutes=15)

    users = info_collection.find()
    for user in users:
        email = user.get('email')
        username = user.get('username')

        if not email or not username:
            continue

        # Get that user's schedule from the tracking collection
        patient = patients_collection.find_one({"username": username})
        if not patient:
            continue

        # --- Medication Reminders ---
        for med in patient.get("medications", []):
            try:
                med_time = datetime.strptime(med["scheduled_time"], "%H:%M")
                scheduled = now.replace(hour=med_time.hour, minute=med_time.minute, second=0, microsecond=0)
                diff = (scheduled - now).total_seconds() / 60

                if 14.5 <= diff <= 15.5:
                    subject = "⏰ Medication Reminder"
                    body = (
                        f"Hello {username},\n\n"
                        f"This is a reminder to take your medication '{med['medication_name']}' at {med['scheduled_time']}.\n\n"
                        f"Stay safe,\nSafeMind Team"
                    )
                    print(f"📧 Sending medication reminder to {email} ({med['medication_name']})")
                    send_email(email, subject, body)
            except Exception as e:
                logging.error(f"❌ Medication reminder error for {username}: {str(e)}")

        # --- Routine Reminders ---
        for routine in patient.get("daily_routines", []):
            try:
                routine_time = datetime.strptime(routine["scheduled_time"], "%H:%M")
                scheduled = now.replace(hour=routine_time.hour, minute=routine_time.minute, second=0, microsecond=0)
                diff = (scheduled - now).total_seconds() / 60

                if 14.5 <= diff <= 15.5:
                    subject = "⏰ Routine Reminder"
                    body = (
                        f"Hello {username},\n\n"
                        f"This is a reminder to complete your routine '{routine['routine_name']}' at {routine['scheduled_time']}.\n\n"
                        f"Stay well,\nSafeMind Team"
                    )
                    print(f"📧 Sending routine reminder to {email} ({routine['routine_name']})")
                    send_email(email, subject, body)
            except Exception as e:
                logging.error(f"❌ Routine reminder error for {username}: {str(e)}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_task_reminders, "interval", minutes=1)
    scheduler.start()
    logging.info("✅ Email reminder scheduler started.")
