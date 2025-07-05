from sqlmodel import Session, select
from ..models import User
from ..routers.utils import try_get_user

def get_users_service(db: Session):
    statement = select(User)
    return db.exec(statement).all()

def get_user_service(user_id: int, db: Session):
    return try_get_user(user_id, db)

def create_user_service(user: User, db: Session):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user_service(user_id: int, new_user: User, db: Session):
    existing_user = try_get_user(user_id, db)
    existing_user.auth0_sub = new_user.auth0_sub
    existing_user.email = new_user.email
    db.commit()
    db.refresh(existing_user)
    return existing_user

def delete_user_service(user_id: int, db: Session):
    user = try_get_user(user_id, db)
    db.delete(user)
    db.commit()