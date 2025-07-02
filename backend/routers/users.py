from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..models import User
from ..database import get_db
from .utils import try_get_user
from ..auth import require_permissions

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", dependencies=[Depends(require_permissions(["get:users"]))])
async def get_users(db: Session = Depends(get_db)):
    users = db.exec(select(User)).all()
    return {"users": users}


@router.get("/{user_id}", dependencies=[Depends(require_permissions(["get:user"]))])
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = try_get_user(user_id, db)
    return {"user": user}


@router.post("/", dependencies=[Depends(require_permissions(["modify:users"]))])
async def create_user(
    user: User,
    db: Session = Depends(get_db)):
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user": user}


@router.put("/{user_id}", dependencies=[Depends(require_permissions(["modify:users"]))])
async def update_user(
    user_id: int,
    user: User,
    db: Session = Depends(get_db)):
    existing_user = try_get_user(user_id, db)
    existing_user.auth0_sub = user.auth0_sub
    db.commit()
    db.refresh(existing_user)
    return {"user": existing_user}


@router.delete("/{user_id}", dependencies=[Depends(require_permissions(["modify:users"]))])
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)):
    user = try_get_user(user_id, db)
    db.delete(user)
    db.commit()
    return {"message": f"User {user_id} deleted successfully"}
