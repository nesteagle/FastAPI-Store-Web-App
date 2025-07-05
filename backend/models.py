from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime, UTC


def utc_now():
    return datetime.now(UTC)


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float = Field(default=None, index=True)
    image_src: str | None = Field(default=None, max_length=300)
    order_items: list["OrderItem"] = Relationship(back_populates="item")


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    auth0_sub: str = Field(index=True, unique=True)
    email: str = Field(index=True)
    orders: list["Order"] = Relationship(back_populates="user")


class Order(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    date: datetime = Field(default_factory=utc_now, index=True)
    stripe_id: str | None = Field(default=None, index=True)
    currency: str | None = Field(default=None)
    amount: int | None = Field(default=None)
    user_id: int = Field(foreign_key="user.id", index=True)
    user: User = Relationship(back_populates="orders")
    order_items: list["OrderItem"] = Relationship(back_populates="order")
    email: str | None = Field(default=None, index=True)


class OrderItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    order: Order = Relationship(back_populates="order_items")
    item_id: int = Field(foreign_key="item.id", index=True)
    item: Item = Relationship(back_populates="order_items")
    quantity: int = Field(default=1)


class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int = 1


class OrderCreate(BaseModel):
    user_id: int
    items: list[OrderItemCreate]
