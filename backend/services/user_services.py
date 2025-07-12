"""
Service functions for user management operations.
Handles CRUD operations for User entities using SQLModel sessions.
"""

from sqlmodel import Session, select
from ..models import User
from .utils import try_get_user


def get_users_service(db: Session):
    """Retrieve all users from the database."""
    statement = select(User)
    return db.exec(statement).all()


def get_user_service(user_id: int, db: Session):
    """Retrieve a single user by ID."""
    return try_get_user(user_id, db)


def create_user_service(user: User, db: Session) -> User:
    """Create a new user in the database."""
    with db.begin():
        db.add(user)
    db.refresh(user)
    return user


def update_user_service(user_id: int, new_user: User, db: Session) -> User:
    """Update an existing user with new data."""
    existing_user = try_get_user(user_id, db)
    with db.begin():
        existing_user.auth0_sub = new_user.auth0_sub
        existing_user.email = new_user.email
    db.refresh(existing_user)
    return existing_user


def delete_user_service(user_id: int, db: Session) -> User:
    """Delete a user from the database."""
    user = try_get_user(user_id, db)
    with db.begin():
        db.delete(user)
    return user
