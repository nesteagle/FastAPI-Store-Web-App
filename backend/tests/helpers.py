from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool
from backend.models import Item, User, Order, OrderItem
from backend.routers import items, users, orders
from backend.database import get_db


def get_test_engine():
    return create_engine(
        "sqlite:///:memory:",
        echo=False,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )


def get_test_db(test_engine):
    def _get_db():
        with Session(test_engine) as session:
            yield session

    return _get_db


def get_test_app():
    test_engine = get_test_engine()
    SQLModel.metadata.create_all(test_engine)

    app = FastAPI()

    app.dependency_overrides[get_db] = get_test_db(test_engine)

    app.include_router(items.router)
    app.include_router(users.router)
    app.include_router(orders.router)

    return app

def create_test_user(client, username= "William"):
    response = client.post("/users/", json = {"username": username})
    assert response.status_code == 200
    return response.json()["user"]

def create_test_item(client, name, price, description = None):
    data = {"name": name, "description": description, "price": price}
    response = client.post("/items/", json=data)
    assert response.status_code == 200
    return response.json()["item"]

def create_test_order(client, user_id, *item_quantity_tuples):
    data = build_order_data(user_id, *item_quantity_tuples)

    response = client.post("/orders/", json=data)
    assert response.status_code == 200
    return response.json()["order"]


def build_order_data(user_id: int, *item_quantity_tuples: tuple) -> dict:
    return {
        "user_id": user_id,
        "items": [
            {"item_id": item["id"], "quantity": quantity}
            for item, quantity in item_quantity_tuples
        ],
    }