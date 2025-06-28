from sqlmodel import Session
from fastapi import HTTPException
from ..models import User, Item, Order


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
    order = db.get(Item, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
