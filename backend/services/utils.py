"""
Utility functions for database operations and data validation.
Provides helpers for item encoding, entity retrieval, and order processing.
"""

import urllib.parse

from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException
from sqlalchemy.orm import selectinload

from backend.models import User, Item, Order, OrderItem, OrderItemCreate


def encode_item_fields(item: Item) -> Item:
    """Validate and encode item image URL for safe storage."""
    if item.image_src:
        sanitized = item.image_src.strip()
        if not sanitized.lower().startswith(("http://", "https://")):
            raise HTTPException(status_code=400, detail="Invalid input provided.")
        sanitized = urllib.parse.quote(sanitized, safe=":/")
        item.image_src = sanitized
    return item


def try_get_user(user_id: int, db: Session) -> User:
    """Retrieve user by ID or raise 404 if not found."""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Resource not found")
    return user


def try_get_item(item_id: int, db: Session) -> Item:
    """Retrieve item by ID or raise 404 if not found."""
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Resource not found")
    return item


def try_get_order(order_id: int, db: Session) -> Order:
    """Retrieve order with items eager-loaded or raise 404 if not found."""
    statement = (
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.order_items).selectinload(OrderItem.item))
    )
    order = db.exec(statement).first()
    if not order:
        raise HTTPException(status_code=404, detail="Resource not found")
    return order


def get_order_details(order: Order):
    """Transform order with eager-loaded items into detailed response format."""
    items = []
    for oi in order.order_items:
        items.append(
            {
                "item_id": oi.item_id,
                "name": oi.item.name,
                "description": oi.item.description if oi.item else None,
                "price": oi.item.price,
                "image_src": oi.item.image_src if oi.item else None,
                "quantity": oi.quantity,
            }
        )
    return {
        "id": order.id,
        "date": order.date,
        "user_id": order.user_id,
        "stripe_id": order.stripe_id,
        "items": items,
    }


def add_order_items(
    db: Session, order_id: int, order_items: List[OrderItemCreate]
) -> None:
    """Add validated order items to an existing order."""
    for item in order_items:
        if item.quantity <= 0:
            raise ValueError("Quantity must be a positive integer")
        db.add(
            OrderItem(order_id=order_id, item_id=item.item_id, quantity=item.quantity)
        )
    db.commit()
