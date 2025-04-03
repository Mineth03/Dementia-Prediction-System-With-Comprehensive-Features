# email_verification.py
import smtplib
import dns.resolver

def verify_email(email):
    domain = email.split('@')[-1]

    # Skip verification for known domains like Gmail, Yahoo, and Outlook
    popular_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
    if domain in popular_domains:
        return True

    try:
        # Get the MX record for the domain
        mx_records = dns.resolver.resolve(domain, 'MX')
        mail_server = str(mx_records[0].exchange)

        # Set up SMTP connection to the mail server
        server = smtplib.SMTP(mail_server, 25, timeout=10)
        server.set_debuglevel(0)

        # SMTP conversation to check if email exists
        server.helo()
        server.mail('yourapp@example.com')
        code, message = server.rcpt(email)

        server.quit()

        # 250 means recipient exists
        if code == 250:
            return True
        else:
            return False

    except Exception as e:
        print(f"Error verifying email: {e}")
        return False
