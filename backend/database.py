"""
Database configuration and session management for the backend application.
Provides SQLModel engine setup and session factories for dependency injection.
"""

import pyodbc
import urllib.parse
from typing import Generator
from sqlmodel import SQLModel, create_engine, Session
import os


server = os.getenv("AZURE_SQL_SERVER")
port = os.getenv("AZURE_SQL_PORT")
database = os.getenv("AZURE_SQL_DATABASE")
user = os.getenv("AZURE_SQL_USER")
password = os.getenv("AZURE_SQL_PASSWORD")

connString = f"Driver={{ODBC Driver 18 for SQL Server}};Server={server},{port};Database={database};UID={user};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30"

params = urllib.parse.quote_plus(connString)
DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency injection factory for database sessions."""
    with Session(engine) as session:
        yield session


def get_db_session() -> Session:
    """Create a new database session for direct use."""
    return Session(engine)
