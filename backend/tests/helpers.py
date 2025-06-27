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
        poolclass=StaticPool
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