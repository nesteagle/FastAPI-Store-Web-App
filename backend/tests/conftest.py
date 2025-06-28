import pytest
from fastapi.testclient import TestClient
from .helpers import get_test_app


@pytest.fixture
def client():
    app = get_test_app()
    with TestClient(app) as client:
        yield client
