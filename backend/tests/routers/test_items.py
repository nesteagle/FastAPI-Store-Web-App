from fastapi.testclient import TestClient
from ..helpers import get_test_app

client = TestClient(get_test_app())

def test_get_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert "items" in response.json()

def test_create_item():
    data = {"name": "Apple", "description": "an apple", "price": 2.99}
    response = client.post("/items/", json=data)
    assert response.status_code == 200
    resp_json = response.json()
    assert "item" in resp_json
    item = resp_json["item"]
    assert item["name"] == data["name"]
    assert item["description"] == data["description"]
    assert item["price"] == data["price"]
    assert "id" in item

def test_put_item():
    return None #stub

def test_delete_item():
    return None #stub
