from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from ..models import Order, OrderCreate, OrderItem, Item, User
from ..database import engine
from datetime import datetime

router = APIRouter(prefix = "/orders", tags = ["orders"])


@router.get("/")
async def get_orders():
    with Session(engine) as session:
        orders = session.exec(select(Order)).all()
        result = []
        for order in orders:
            order_items = session.exec(
                select(OrderItem).where(OrderItem.order_id == order.id)
            ).all()
            items = []
            for oi in order_items:
                item = session.get(Item, oi.item_id)
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


@router.post("/")
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


@router.put("/{order_id}")
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


@router.delete("/{order_id}")
async def delete_order(order_id: int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).delete()
        session.delete(order)
        session.commit()
    return {"message": f"Order {order_id} deleted successfully"}
