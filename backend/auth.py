import json
import os
from typing import Optional

from dotenv import load_dotenv
import http.client
from sqlmodel import Session, select
from .database import get_db
from .models import User
import jwt
from fastapi import Depends, HTTPException, status, Security, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.responses import RedirectResponse

from fastapi_plugin import Auth0FastAPI

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
AUTH0_ISSUER = os.getenv("AUTH0_ISSUER")
AUTH0_ALGORITHM = os.getenv("AUTH0_ALGORITHM")
EMAIL_CUSTOM_CLAIM = "https://fastapi-store-webapp/email"

auth = Auth0FastAPI(domain=AUTH0_DOMAIN, audience=AUTH0_API_AUDIENCE)


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)


class UnauthenticatedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Requires authentication"
        )


class ExtractUserData:
    def __init__(self):
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    async def extract(
        self, token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer())
    ) -> dict:
        if token is None:
            raise UnauthenticatedException()
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(
                token.credentials
            ).key
            payload = jwt.decode(
                token.credentials,
                signing_key,
                algorithms=AUTH0_ALGORITHM,
                audience=AUTH0_API_AUDIENCE,
                issuer=AUTH0_ISSUER,
                leeway=10,
            )
        except Exception as error:
            raise UnauthorizedException(str(error))
        sub = payload.get("sub")
        email = payload.get(EMAIL_CUSTOM_CLAIM)
        if not sub or not email:
            raise UnauthorizedException("Token does not contain required data")
        return {"sub": sub, "email": email}


user_sub_extractor = ExtractUserData()


def get_access_token():
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)
    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials",
    }
    headers = {"content-type": "application/json"}
    conn.request("POST", "/oauth/token", json.dumps(payload), headers)
    res = conn.getresponse()
    data = res.read()
    return json.loads(data.decode("utf-8"))["access_token"]


def update_from_auth0(db: Session = Depends(get_db)):
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)
    headers = {"authorization": f"Bearer {get_access_token()}"}
    conn.request("GET", "/api/v2/users", headers=headers)
    res = conn.getresponse()
    users = json.loads(res.read().decode("utf-8"))
    for user in users:
        username = user.get("username")
        if (
            username
            and not db.exec(select(User).where(User.username == username)).first()
        ):
            db.add(User(username=username))
    db.commit()


def require_permissions(required_permissions: list):
    def dependency(claims: dict = Depends(auth.require_auth())):
        if claims is None:
            raise UnauthorizedException
        permissions = claims.get("permissions", [])
        for permission in required_permissions:
            if permission not in permissions:
                raise UnauthorizedException("Missing permission")
        return claims

    return dependency


def get_current_user(
    user_data: dict = Security(user_sub_extractor.extract),
    db: Session = Depends(get_db),
):
    user_sub = user_data["sub"]
    user_email = user_data["email"]
    user = db.exec(select(User).where(User.auth0_sub == user_sub)).first()
    if user:
        user.email = user_email # update email
        db.commit()
    else:
        user = User(auth0_sub=user_sub, email=user_email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
