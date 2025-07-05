from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from ..models import Item
from ..database import get_db
from ..auth import require_permissions
from ..services.item_services import (
    get_items_service,
    get_item_service,
    create_item_service,
    delete_item_service,
    update_item_service,
)

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/")
async def get_items(
    search: str = Query("", description="Search items by name"),
    db: Session = Depends(get_db),
):
    items = get_items_service(search, db)
    return {"items": items}


@router.get("/{item_id}")
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = get_item_service(item_id, db)
    return {"item": item}


@router.post("/", dependencies=[Depends(require_permissions(["modify:items"]))])
async def create_item(
    item: Item,
    db: Session = Depends(get_db),
):
    new_item = create_item_service(item, db)
    return {"item": new_item}


@router.delete(
    "/{item_id}", dependencies=[Depends(require_permissions(["modify:items"]))]
)
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    delete_item_service(item_id, db)
    return {"message": f"Item {item_id} deleted successfully"}


@router.put("/{item_id}", dependencies=[Depends(require_permissions(["modify:items"]))])
async def update_item(
    item_id: int,
    item: Item,
    db: Session = Depends(get_db),
):
    updated_item = update_item_service(item_id, item, db)
    return {"item": updated_item}
