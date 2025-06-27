from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models import Item
from ..database import get_db

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/")
async def get_items(db: Session = Depends(get_db)):
    items = db.exec(select(Item)).all()
    return {"items": items}


@router.post("/")
async def create_item(item: Item, db: Session = Depends(get_db)):
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"item": item}


@router.delete("/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": f"Item {item_id} deleted successfully"}


@router.put("/{item_id}")
async def update_item(item_id: int, item: Item, db: Session = Depends(get_db)):
    existing_item = db.get(Item, item_id)
    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")
    existing_item.name = item.name
    existing_item.description = item.description
    existing_item.price = item.price
    db.commit()
    db.refresh(existing_item)
    return {"item": existing_item}
