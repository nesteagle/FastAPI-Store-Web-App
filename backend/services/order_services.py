from typing import List, Dict, Any
from sqlmodel import Session, select, delete
from ..models import Order, OrderCreate, OrderItem, User
from ..routers.utils import (
    try_get_user,
    try_get_order,
    get_order_details,
    add_order_items,
)


def get_user_orders_service(current_user: User, db: Session) -> List[Dict[str, Any]]:
    statement = select(Order).where(Order.user_id == current_user.id)
    orders = db.exec(statement).all()
    return [get_order_details(order) for order in orders]


def get_order_by_id_service(order_id: int, db: Session) -> Dict[str, Any]:
    order = try_get_order(order_id, db)
    return get_order_details(order)


def create_order_service(order_data: OrderCreate, db: Session) -> Dict[str, Any]:
    try_get_user(order_data.user_id, db)
    new_order = Order(
        user_id=order_data.user_id,
        stripe_id=order_data.stripe_id,
        currency=order_data.currency,
        amount=order_data.amount,
        email=order_data.email,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    add_order_items(db, new_order.id, order_data.items)
    detailed_order = try_get_order(new_order.id, db)
    return get_order_details(detailed_order)


def update_order_service(
    order_id: int, order_data: OrderCreate, db: Session
) -> Dict[str, Any]:
    existing_order = try_get_order(order_id, db)
    try_get_user(order_data.user_id, db)
    existing_order.user_id = order_data.user_id
    existing_order.stripe_id = order_data.stripe_id
    existing_order.currency = order_data.currency
    existing_order.amount = order_data.amount
    existing_order.email = order_data.email
    try:
        db.commit()
        db.refresh(existing_order)
        db.exec(delete(OrderItem).where(OrderItem.order_id == order_id))
        # Optionally commit here if needed, or let add_order_items handle it.
        add_order_items(db, existing_order.id, order_data.items)
    except Exception as e:
        db.rollback()
        raise e
    updated_order = try_get_order(order_id, db)
    return get_order_details(updated_order)


def delete_order_service(order_id: int, db: Session) -> None:
    order = try_get_order(order_id, db)
    db.exec(delete(OrderItem).where(OrderItem.order_id == order_id))
    db.delete(order)
    db.commit()


def get_orders_admin_service(db: Session) -> List[Dict[str, Any]]:
    orders = db.exec(select(Order)).all()
    return [get_order_details(order) for order in orders]