from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from contextlib import asynccontextmanager
from .routers import items, users, orders, admin
from fastapi.responses import RedirectResponse
from .models import User
from .auth import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    # cleanup here if needed


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(admin.router)

@app.get("/myaccount")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/callback")
async def auth_callback(request: Request):
    # ... process Auth0 response, set session or cookies ...
    return RedirectResponse(url="/myaccount")