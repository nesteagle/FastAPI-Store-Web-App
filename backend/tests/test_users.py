from .helpers import create_test_user


def test_get_users(client):
    response = client.get("/users/")
    assert response.status_code == 200
    assert "users" in response.json()


def test_create_user(client):
    username = "John"
    user = create_test_user(client, username = "John")
    assert user["username"] == username


def test_put_user(client):
    user_id = create_test_user(client, "Jeff")["id"]
    updated_user = {"username": "Bryan"}
    update_response = client.put(f"/users/{user_id}", json=updated_user)
    assert update_response.status_code == 200
    resp_json = update_response.json()
    assert "user" in resp_json
    response_user = resp_json["user"]
    assert updated_user["username"] == response_user["username"]


def test_delete_user(client):
    user_id = create_test_user(client, "Michael")["id"]

    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"User {user_id} deleted successfully"

    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "User not found"
