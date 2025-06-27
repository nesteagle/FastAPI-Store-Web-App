from sqlmodel import SQLModel, create_engine

sqlite_file_name = "/app/backend/db/database.db"

# TODO: use docker volume to add DB into 

sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
