from fastapi import FastAPI, Form, Request, HTTPException
from pydantic import BaseModel
from sqlmodel import (
    Field,
    Session,
    SQLModel,
    create_engine,
    select,
    col,
    or_,
    Relationship,
)
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


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


@app.get("/items/")
async def get_items():
    items = get_items_from_db()
    return {"items": items}


@app.post("/items/")
async def create_item(item: Item):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
    return {"item": item}


@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
    return {"message": f"Item {item_id} deleted successfully"}


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, query: str | None = None):
    with Session(engine) as session:
        existing_item = session.get(Item, item_id)
        if not existing_item:
            return create_item(item)

        existing_item.name = item.name
        existing_item.description = item.description
        existing_item.price = item.price
        session.commit()
        session.refresh(existing_item)
        return {"item": existing_item}


@app.get("/users/")
async def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return {"users": users}


@app.post("/users/")
async def create_user(user: User):
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return {"user": user}


@app.put("/users/{user_id}")
async def update_user(user_id: int, user: User):
    with Session(engine) as session:
        existing_user = session.get(User, user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        existing_user.username = user.username
        session.commit()
        session.refresh(existing_user)
        return {"user": existing_user}


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        session.delete(user)
        session.commit()
    return {"message": f"User {user_id} deleted successfully"}


@app.get("/orders/")
async def get_orders():
    with Session(engine) as session:
        orders = session.exec(select(Order)).all()
        return {"orders": orders}


@app.post("/orders/")
async def create_order(order: OrderCreate):
    with Session(engine) as session:
        user = session.get(User, order.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_order = Order(user_id=order.user_id, date=datetime.now().isoformat())
        session.add(new_order)
        session.commit()
        session.refresh(new_order)

        for item in order.items:
            session.add(
                OrderItem(
                    order_id=new_order.id, item_id=item.item_id, quantity=item.quantity
                )
            )
        session.commit()
        return {"order": new_order}


@app.put("/orders/{order_id}")
async def update_order(order_id: int, order: OrderCreate):
    with Session(engine) as session:
        existing_order = session.get(Order, order_id)
        if not existing_order:
            raise HTTPException(status_code=404, detail="Order not found")

        user = session.get(User, order.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        existing_order.user_id = order.user_id
        session.commit()
        session.refresh(existing_order)

        session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).delete()

        for item in order.items:
            session.add(
                OrderItem(
                    order_id=existing_order.id,
                    item_id=item.item_id,
                    quantity=item.quantity,
                )
            )
        session.commit()

        return {"order": existing_order}


@app.delete("/orders/{order_id}")
async def delete_order(order_id: int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).delete()
        session.delete(order)
        session.commit()
    return {"message": f"Order {order_id} deleted successfully"}


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_items_from_db():
    with Session(engine) as session:
        all_items = session.exec(select(Item)).all()
        print(all_items)
        return all_items


def get_items_above_price(price: float):
    with Session(engine) as session:
        statement = select(Item).where(
            or_(col(Item.price) > price, col(Item.price) == price)
        )
        items_above_price = session.exec(statement).all()
        return items_above_price


def main():
    create_db_and_tables()


if __name__ == "__main__":
    main()
