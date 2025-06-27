from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from ..models import User
from ..database import engine

router = APIRouter(prefix = "/users", tags = ["users"])

@router.get("/")
async def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return {"users": users}


@router.post("/")
async def create_user(user: User):
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return {"user": user}


@router.put("/{user_id}")
async def update_user(user_id: int, user: User):
    with Session(engine) as session:
        existing_user = session.get(User, user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        existing_user.username = user.username
        session.commit()
        session.refresh(existing_user)
        return {"user": existing_user}


@router.delete("/{user_id}")
async def delete_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        session.delete(user)
        session.commit()
    return {"message": f"User {user_id} deleted successfully"}