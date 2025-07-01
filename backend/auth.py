import json
import os
from typing import Optional

from dotenv import load_dotenv
import http.client
from sqlmodel import Session, select
from .database import engine
from .models import User
import jwt
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import SecurityScopes, HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
AUTH0_ISSUER = os.getenv("AUTH0_ISSUER")
AUTH0_ALGORITHM = os.getenv("AUTH0_ALGORITHM")


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)


class UnauthenticatedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Requires authentication"
        )


class VerifyToken:
    def __init__(self, required_permissions: list = None):
        self.required_permissions = required_permissions or []
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    async def verify(
        self,
        security_scopes: SecurityScopes,
        token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer()),
    ):
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
        except (
            jwt.exceptions.PyJWKClientError,
            jwt.exceptions.DecodeError,
            Exception,
        ) as error:
            raise UnauthorizedException(str(error))

        permissions = payload.get("permissions")
        print(permissions)
        for permission in self.required_permissions:
            if permission not in permissions:
                raise UnauthorizedException("Missing permission")
            
        return payload


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


def update_from_auth0():
    conn = http.client.HTTPSConnection(AUTH0_DOMAIN)
    headers = {"authorization": f"Bearer {get_access_token()}"}
    conn.request("GET", "/api/v2/users", headers=headers)
    res = conn.getresponse()
    users = json.loads(res.read().decode("utf-8"))

    with Session(engine) as session:
        for user in users:
            username = user.get("username")
            if (
                username
                and not session.exec(
                    select(User).where(User.username == username)
                ).first()
            ):
                session.add(User(username=username))
        session.commit()


def require_permissions(required_permissions: list = None):
    verifier = VerifyToken(required_permissions or [])
    return Security(verifier.verify)
