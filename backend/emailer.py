import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

def send_email(topic, summary, to_email):
    msg = MIMEText(f"<h2>{topic}</h2><p>{summary}</p>", "html")
    msg["Subject"] = f"Insights on {topic}"
    msg["From"] = os.getenv("EMAIL_SENDER")
    msg["To"] = to_email

    with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("EMAIL_SENDER"), os.getenv("EMAIL_PASSWORD"))
        server.send_message(msg)
