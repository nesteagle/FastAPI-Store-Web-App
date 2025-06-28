from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float = Field(default=None, index=True)
    order_items: list["OrderItem"] = Relationship(back_populates="item")


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, max_length=20)
    orders: list["Order"] = Relationship(back_populates="user")


class Order(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    date: str = Field(default=None, index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    user: User = Relationship(back_populates="orders")
    order_items: list["OrderItem"] = Relationship(back_populates="order")


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
