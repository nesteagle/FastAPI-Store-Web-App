"""
Pytest configuration and fixtures for tests.
This module provides fixtures and helpers for:
- Creating a test database session
- Managing database session lifecycle for tests

Each test uses the db_session fixture to interact with an isolated test database.
"""

import pytest
from .helpers import get_test_session


@pytest.fixture
def db_session():
    """Provide a test database session"""
    session = get_test_session()
    try:
        yield session
    finally:
        session.close()
