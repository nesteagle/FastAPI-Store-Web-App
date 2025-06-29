from .helpers import create_test_item


def test_get_items(client):
    response = client.get("/items/")
    assert response.status_code == 200
    assert "items" in response.json()


def test_create_item(client):
    name = "Apple"
    description = "an apple"
    price = 2.99
    item = create_test_item(client, name=name, description=description, price=price)
    assert item["name"] == name
    assert item["description"] == description
    assert item["price"] == price
    assert "id" in item


def test_put_item(client):
    item_id = create_test_item(client, name="Mouse", description="N/A", price=10.99)[
        "id"
    ]
    update_data = {"name": "Orange", "description": "an orange", "price": 1.99}

    update_response = client.put(
        f"/items/{item_id}",
        json=update_data
    )
    assert update_response.status_code == 200
    resp_json = update_response.json()

    assert "item" in resp_json
    updated = resp_json["item"]

    assert updated["name"] == update_data["name"]
    assert updated["description"] == update_data["description"]
    assert updated["price"] == update_data["price"]


def test_delete_item(client):
    item_id = create_test_item(
        client, name="Inorganic Apple", description="is it still an apple?", price=0.99
    )["id"]

    delete_response = client.delete(f"/items/{item_id}")
    assert delete_response.status_code == 200

    resp_json = delete_response.json()
    assert "message" in resp_json
    assert resp_json["message"] == f"Item {item_id} deleted successfully"

    get_response = client.get(f"/items/{item_id}")
    assert get_response.status_code == 404  # make sure item is gone and not found
    assert get_response.json()["detail"] == "Item not found"
