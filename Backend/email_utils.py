import smtplib
from email.mime.text import MIMEText

def send_email(to, subject, body):
    try:
        sender = "safeminddsgp@gmail.com"
        password = "dkwyozwvwivzfcng"

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = to

        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
