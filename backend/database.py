from sqlmodel import SQLModel, create_engine, Session

from .models import Item, User, Order, OrderItem

sqlite_file_name = "/app/backend/db/database.db"


sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_db():
    with Session(engine) as session:
        yield session
