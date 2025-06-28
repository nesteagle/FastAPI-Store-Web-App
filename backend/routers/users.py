from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..models import User
from ..database import get_db
from .utils import try_get_user


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
async def get_users(db: Session = Depends(get_db)):
    users = db.exec(select(User)).all()
    return {"users": users}


@router.get("/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = try_get_user(user_id, db)
    return {"user": user}


@router.post("/")
async def create_user(user: User, db: Session = Depends(get_db)):
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user": user}


@router.put("/{user_id}")
async def update_user(user_id: int, user: User, db: Session = Depends(get_db)):
    existing_user = try_get_user(user_id, db)
    existing_user.username = user.username
    db.commit()
    db.refresh(existing_user)
    return {"user": existing_user}


@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = try_get_user(user_id, db)
    db.delete(user)
    db.commit()
    return {"message": f"User {user_id} deleted successfully"}
