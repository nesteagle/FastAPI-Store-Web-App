from sqlmodel import Session, select
from fastapi import HTTPException
from ..models import User, Item, Order, OrderItem
from sqlalchemy.orm import selectinload


def try_get_user(user_id: int, db: Session) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def try_get_item(item_id: int, db: Session) -> Item:
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


def try_get_order(order_id: int, db: Session) -> Order:
    statement = (
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.order_items).selectinload(OrderItem.item))
    )
    order = db.exec(statement).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def get_order_details(order: Order, db: Session):
    # requires order.order_items and OrderItem.item to be eager-loaded (already loaded in).
    items = []
    for oi in order.order_items:
        items.append(
            {
                "item_id": oi.item_id,
                "name": oi.item.name if oi.item else None,
                "description": oi.item.description if oi.item else None,
                "price": oi.item.price if oi.item else None,
                "quantity": oi.quantity,
            }
        )
    return {
        "id": order.id,
        "date": order.date,
        "user_id": order.user_id,
        "items": items,
    }


def add_order_items(db: Session, order_id: int, order_items: list) -> None:
    for item in order_items:
        if (item.quantity <= 0):
            raise ValueError("Quantity must be a positive integer")
        db.add(
            OrderItem(order_id=order_id, item_id=item.item_id, quantity=item.quantity)
        )
    db.commit()
