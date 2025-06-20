from fastapi import FastAPI, Form, Request, HTTPException
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine, select, col, or_
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str | None = Field(index=True, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float = Field(default=None, index=True)


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"message": "HELLOWORLD"}
    )


@app.get("/items/")
async def get_items():
    items = get_items_from_db()        
    return {"items": items}


@app.post("/items/")
async def create_item(item: Item):
    with Session(engine) as session:
        session.add(item)
        session.commit()
        session.refresh(item)
    return {"item": item}

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
    return {"message": "Item" + item + "deleted successfully"}

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, query: str | None = None):
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


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_items_from_db():
    with Session(engine) as session:
        all_items = session.exec(select(Item)).all()
        print(all_items)
        return all_items


def get_items_above_price(price: float):
    with Session(engine) as session:
        statement = select(Item).where(
            or_(col(Item.price) > price, col(Item.price) == price)
        )
        items_above_price = session.exec(statement).all()
        return items_above_price


def main():
    create_db_and_tables()


if __name__ == "__main__":
    main()
