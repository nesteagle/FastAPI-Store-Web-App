from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..models import Order, OrderCreate, OrderItem, Item
from ..database import get_db
from datetime import datetime
from .utils import try_get_user, try_get_order

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/")
async def get_orders(db: Session = Depends(get_db)):
    orders = db.exec(select(Order)).all()
    result = []
    for order in orders:
        order_items = db.exec(
            select(OrderItem).where(OrderItem.order_id == order.id)
        ).all()
        items = []
        for oi in order_items:
            item = db.get(Item, oi.item_id)
            items.append(
                {
                    "item_id": oi.item_id,
                    "name": item.name if item else None,
                    "description": item.description if item else None,
                    "price": item.price if item else None,
                    "quantity": oi.quantity,
                }
            )
        result.append(
            {
                "id": order.id,
                "date": order.date,
                "user_id": order.user_id,
                "items": items,
            }
        )
    return {"orders": result}


@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = try_get_order(order_id, db)
    return {"order": order}


@router.post("/")
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try_get_user(order.user_id, db)  # make sure user exists

    new_order = Order(user_id=order.user_id, date=datetime.now().isoformat())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order.items:
        db.add(
            OrderItem(
                order_id=new_order.id, item_id=item.item_id, quantity=item.quantity
            )
        )
    db.commit()
    return {"order": new_order}


@router.put("/{order_id}")
async def update_order(
    order_id: int, order: OrderCreate, db: Session = Depends(get_db)
):
    existing_order = try_get_order(order_id, db)

    try_get_user(order.user_id, db)  # make sure user exists

    existing_order.user_id = order.user_id
    db.commit()
    db.refresh(existing_order)

    db.exec(select(OrderItem).where(OrderItem.order_id == order_id)).delete()

    for item in order.items:
        db.add(
            OrderItem(
                order_id=existing_order.id,
                item_id=item.item_id,
                quantity=item.quantity,
            )
        )
    db.commit()

    return {"order": existing_order}


@router.delete("/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = try_get_order(order_id, db)

    db.exec(select(OrderItem).where(OrderItem.order_id == order_id)).delete()
    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted successfully"}
