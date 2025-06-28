import json
from dotenv import load_dotenv
import http.client
from sqlmodel import Session, select
from .database import engine
from .models import User
import os

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUDIENCE = f"https://{AUTH0_DOMAIN}/api/v2/"


def update_from_auth0():
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)
    headers = {"authorization": f"Bearer {get_access_token()}"}
    conn.request("GET", "/api/v2/users", headers=headers)
    res = conn.getresponse()
    data = res.read().decode("utf-8")
    users = json.loads(data)

    with Session(engine) as session:
        for user in users:
            username = user.get("username")
            if not username:
                continue
            # Check if user exists
            existing = session.exec(
                select(User).where(User.username == username)
            ).first()
            if not existing:
                session.add(User(username=username))
        session.commit()


def get_access_token():
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)

    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": AUDIENCE,
        "grant_type": "client_credentials",
    }

    payload_json = json.dumps(payload)

    headers = {"content-type": "application/json"}

    conn.request("POST", "/oauth/token", payload_json, headers)

    res = conn.getresponse()
    data = res.read()

    return json.loads(data.decode("utf-8"))["access_token"]
