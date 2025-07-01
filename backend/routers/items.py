from fastapi import APIRouter, Depends, Security
from sqlmodel import Session, select
from ..models import Item
from ..database import get_db
from .utils import try_get_item, encode_item_fields
from ..auth import require_permissions

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/")
async def get_items(db: Session = Depends(get_db)):
    items = db.exec(select(Item)).all()
    return {"items": items}


@router.get("/{item_id}")
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = try_get_item(item_id, db)
    return {"item": item}


@router.post("/")
async def create_item(
    item: Item,
    db: Session = Depends(get_db),
    auth_result: str = require_permissions(["modify:items"]),
):
    item = encode_item_fields(item)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"item": item}


@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    auth_result: str = require_permissions(["modify:items"]),
):
    item = try_get_item(item_id, db)
    db.delete(item)
    db.commit()
    return {"message": f"Item {item_id} deleted successfully"}


@router.put("/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    db: Session = Depends(get_db),
    auth_result: str = require_permissions(["modify:items"]),
):
    existing_item = try_get_item(item_id, db)
    existing_item.name = item.name
    existing_item.description = item.description
    existing_item.price = item.price
    existing_item.image_src = item.image_src
    existing_item = encode_item_fields(item)
    db.commit()
    db.refresh(existing_item)
    return {"item": existing_item}
