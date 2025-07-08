from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend.database import get_db
from backend.auth import require_permissions
from backend.services.order_services import get_orders_admin_service
from backend.services.user_services import get_users_service

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/orders/", dependencies=[Depends(require_permissions(["get:orders"]))]) # where get:orders is an admin permission on Auth0
async def get_all_orders(db: Session = Depends(get_db)):
    orders = get_orders_admin_service(db)
    print("admin permission done")
    return {"orders": orders}

@router.get("/users/", dependencies=[Depends(require_permissions(["get:users"]))]) # get:users is an admin-level permission
async def get_users(db: Session = Depends(get_db)):
    users = get_users_service(db)
    return {"users": users}