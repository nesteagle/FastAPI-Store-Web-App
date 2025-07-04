from fastapi import APIRouter, Depends
from sqlmodel import Session, select, delete
from ..models import Order, OrderCreate, OrderItem, User
from ..database import get_db
from datetime import datetime
from .utils import try_get_user, try_get_order, get_order_details, add_order_items
from sqlalchemy.orm import selectinload
from ..auth import require_permissions, get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/") #, dependencies=[Depends(require_permissions(["get:orders"]))]
async def get_my_orders(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    statement = (
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.order_items).selectinload(OrderItem.item))
    )
    orders = db.exec(statement).all()
    result = [get_order_details(order, db) for order in orders]
    return {"orders": result}


@router.get("/{order_id}", dependencies=[Depends(require_permissions(["get:order"]))])
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = try_get_order(order_id, db)
    order_details = get_order_details(order, db)
    return {"order": order_details}


@router.post("/", dependencies=[Depends(require_permissions(["modify:orders"]))])
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try_get_user(order.user_id, db)  # make sure user exists

    new_order = Order(user_id=order.user_id, date=datetime.now().isoformat())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    add_order_items(db, new_order.id, order.items)

    detailed_order = try_get_order(new_order.id, db)
    order_details = get_order_details(detailed_order, db)
    return {"order": order_details}


@router.put(
    "/{order_id}", dependencies=[Depends(require_permissions(["modify:orders"]))]
)
async def update_order(
    order_id: int, order: OrderCreate, db: Session = Depends(get_db)
):
    existing_order = try_get_order(order_id, db)

    try_get_user(order.user_id, db)  # make sure user exists

    existing_order.user_id = order.user_id
    db.commit()
    db.refresh(existing_order)

    db.exec(delete(OrderItem).where(OrderItem.order_id == order_id))
    db.commit()
    add_order_items(db, existing_order.id, order.items)

    updated_order = try_get_order(order_id, db)
    order_details = get_order_details(updated_order, db)

    return {"order": order_details}


@router.delete(
    "/{order_id}", dependencies=[Depends(require_permissions(["modify:orders"]))]
)
async def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = try_get_order(order_id, db)

    db.exec(delete(OrderItem).where(OrderItem.order_id == order_id))
    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted successfully"}
