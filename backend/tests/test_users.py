"""
Unit tests for user-related service functions.
This module contains tests for the following user service operations:
- Retrieving all users
- Creating a user
- Retrieving a user by ID
- Updating a user
- Deleting a user
- Handling duplicate user creation
- Handling updates and deletions for non-existent users
Each test uses a database session fixture and helper functions to create test users.
"""

import pytest
from backend.services.user_services import (
    get_users_service,
    get_user_service,
    create_user_service,
    update_user_service,
    delete_user_service,
)
from backend.models import User
from .helpers import create_test_user


def test_get_users_service(db_session):
    """Test getting all users"""
    create_test_user(db_session, email="john@example.com", auth0_sub="auth0|john123")
    create_test_user(db_session, email="jane@example.com", auth0_sub="auth0|jane456")

    users = get_users_service(db_session)
    assert len(users) == 2

    emails = [user.email for user in users]
    assert "john@example.com" in emails
    assert "jane@example.com" in emails


def test_create_user_service(db_session):
    """Test creating a user"""
    user = User(email="alice@example.com", auth0_sub="auth0|alice789")

    created_user = create_user_service(user, db_session)

    assert created_user.email == "alice@example.com"
    assert created_user.auth0_sub == "auth0|alice789"
    assert created_user.id is not None


def test_get_user_service(db_session):
    """Test getting a single user by ID"""
    created_user = create_test_user(
        db_session, email="bob@example.com", auth0_sub="auth0|bob123"
    )

    retrieved_user = get_user_service(created_user.id, db_session)

    assert retrieved_user.email == "bob@example.com"
    assert retrieved_user.auth0_sub == "auth0|bob123"


def test_update_user_service(db_session):
    """Test updating a user"""
    created_user = create_test_user(
        db_session, "Charlie", "charlie@example.com", "auth0|charlie456"
    )

    # Update user data
    updated_data = User(
        email="chuck@example.com",
        auth0_sub="auth0|charlie456",
    )

    updated_user = update_user_service(created_user.id, updated_data, db_session)

    assert updated_user.email == "chuck@example.com"
    assert updated_user.id == created_user.id


def test_delete_user_service(db_session):
    """Test deleting a user"""
    created_user = create_test_user(db_session, "david@example.com", "auth0|david789")

    delete_user_service(created_user.id, db_session)

    with pytest.raises(Exception):
        delete_user_service(created_user.id, db_session)


def test_create_duplicate_user_service(db_session):
    """Test creating a user with duplicate Auth0 subject"""
    auth0_sub = "auth0|duplicate123"

    user1 = User(email="frank@example.com", auth0_sub=auth0_sub)
    create_user_service(user1, db_session)

    # Try to create second user with same auth0_sub
    user2 = User(email="franklin@example.com", auth0_sub=auth0_sub)

    with pytest.raises(Exception):  # raises Pydantic integrity error
        create_user_service(user2, db_session)


def test_update_nonexistent_user_service(db_session):
    """Test updating a user that doesn't exist"""
    nonexistent_id = 99999

    updated_data = User(email="ghost@example.com", auth0_sub="auth0|ghost123")

    with pytest.raises(Exception):  # raises not found error
        update_user_service(nonexistent_id, updated_data, db_session)


def test_delete_nonexistent_user_service(db_session):
    """Test deleting a user that doesn't exist"""
    nonexistent_id = 99999

    with pytest.raises(Exception):  # raises not found error
        delete_user_service(nonexistent_id, db_session)
