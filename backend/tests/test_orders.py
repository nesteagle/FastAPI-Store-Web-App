from .helpers import (
    create_test_item,
    create_test_user,
    create_test_order,
    build_order_data,
)


def assert_order(order, expected_items, expected_user_id):
    assert "items" in order
    assert order["user_id"] == expected_user_id
    for oi in order["items"]:
        expected = expected_items[oi["item_id"]]
        assert oi["quantity"] == expected["quantity"]
        assert oi["name"] == expected["name"]
        assert oi["description"] == expected["description"]
        assert oi["price"] == expected["price"]


def build_expected_items(*item_quantity_tuples):
    expected = {}
    for item, quantity in item_quantity_tuples:
        expected[item["id"]] = {**item, "quantity": quantity}
    return expected


def test_get_orders(client):
    response = client.get("/orders/")
    assert response.status_code == 200
    assert "orders" in response.json()


def test_create_order(client):
    user = create_test_user(client, username="John")
    user_id = user["id"]

    item_1 = create_test_item(client, name="Apple", description="an apple", price=2.99)
    item_2 = create_test_item(client, name="Banana", description="BANANA!", price=0.99)

    item_1_quantity = 4
    item_2_quantity = 2

    expected_items = build_expected_items(
        (item_1, item_1_quantity), (item_2, item_2_quantity)
    )
    assert_order(
        create_test_order(
            client, user_id, (item_1, item_1_quantity), (item_2, item_2_quantity)
        ),
        expected_items,
        user_id,
    )


def test_put_order(client):
    user = create_test_user(client, username="Robin")
    user_id = user["id"]

    original_item_1 = create_test_item(client, name="Metronome", price=15.99)
    order_id = create_test_order(client, user_id, (original_item_1, 2))["id"]

    item_1 = create_test_item(
        client, name="Kiwi", description="Premium kiwi with great taste", price=5.99
    )
    item_2 = create_test_item(client, name="Mango", description="fruit.", price=4.50)
    item_3 = create_test_item(client, name="Olives", price=3.00)

    item_1_quantity = 6
    item_2_quantity = 3
    item_3_quantity = 5

    data = build_order_data(
        user_id,
        (item_1, item_1_quantity),
        (item_2, item_2_quantity),
        (item_3, item_3_quantity),
    )

    response = client.put(f"/orders/{order_id}", json=data)
    assert response.status_code == 200

    expected_items = build_expected_items(
        (item_1, item_1_quantity), (item_2, item_2_quantity), (item_3, item_3_quantity)
    )
    assert_order(response.json()["order"], expected_items, user_id)


def test_delete_order(client):
    user = create_test_user(client, username="Aaron")
    user_id = user["id"]

    item_1 = create_test_item(
        client, name="Grapes", description=None, price=5.99
    )
    item_1_quantity = 10
    data = build_order_data(
        user_id,
        (item_1, item_1_quantity)
    )
    order_id = create_test_order(client, user_id, (item_1, item_1_quantity))["id"]
    response = client.delete(f"/orders/{order_id}")
    assert response.status_code == 200
    assert response.json()["message"] == f"Order {order_id} deleted successfully"

    get_response = client.get(f"/orders/{order_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "Order not found"
    
