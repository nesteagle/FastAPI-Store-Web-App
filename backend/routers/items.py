from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from ..models import Item
from ..database import engine

router = APIRouter(prefix = "/items", tags = ["items"])

@router.get("/")
async def get_items():
    with Session(engine) as session:
        items = session.exec(select(Item)).all()
        return {"items": items}


@router.post("/")
async def create_item(item: Item):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
    return {"item": item}


@router.delete("/{item_id}")
async def delete_item(item_id: int):
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
    return {"message": f"Item {item_id} deleted successfully"}


@router.put("/{item_id}")
async def update_item(item_id: int, item: Item):
    with Session(engine) as session:
        existing_item = session.get(Item, item_id)
        if not existing_item:
            return create_item(item)

        existing_item.name = item.name
        existing_item.description = item.description
        existing_item.price = item.price
        session.commit()
        session.refresh(existing_item)
        return {"item": existing_item}

