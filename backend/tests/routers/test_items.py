def test_get_items(client):
    response = client.get("/items/")
    assert response.status_code == 200
    assert "items" in response.json()


def test_create_item(client):
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


def test_put_item(client):
    data = {"name": "Organic Apple", "description": "an ORGANIC apple", "price": 4.99}
    response = client.post("/items/", json=data)
    item_id = response.json()["item"]["id"]
    assert response.status_code == 200

    update_data = {"name": "Orange", "description": "an orange", "price": 1.99}
    update_response = client.put(
        f"/items/{item_id}",
        json=update_data,
    )
    assert update_response.status_code == 200
    resp_json = update_response.json()

    assert "item" in resp_json
    updated = resp_json["item"]

    assert updated["name"] == update_data["name"]
    assert updated["description"] == update_data["description"]
    assert updated["price"] == update_data["price"]


def test_delete_item(client):
    data = {
        "name": "Inorganic Apple",
        "description": "is it still an apple?",
        "price": 0.99,
    }
    response = client.post("/items/", json=data)
    assert response.status_code == 200
    item_id = response.json()["item"]["id"]

    delete_response = client.delete(f"/items/{item_id}")
    assert delete_response.status_code == 200

    resp_json = delete_response.json()
    assert "message" in resp_json
    assert resp_json["message"] == f"Item {item_id} deleted successfully"

    get_response = client.get(f"/items/{item_id}")
    assert get_response.status_code == 404  # make sure item is gone and not found
    assert get_response.json()["detail"] == "Item not found"
