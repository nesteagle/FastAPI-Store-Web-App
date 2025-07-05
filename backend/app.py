from fastapi import FastAPI, Depends, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables, get_db
from contextlib import asynccontextmanager
from .routers import items, users, orders, admin
from fastapi.responses import RedirectResponse
from .models import User, Order, Item
from .auth import get_current_user
import os
from dotenv import load_dotenv
import stripe
import json
from .routers.orders import add_order_to_db

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


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


@app.post("/create-checkout-session/")
async def create_checkout_session(
    request: Request,
    current_user=Depends(get_current_user),
):
    # TODO: check if user email is verified before
    cart_items = await request.json()  # Already parsed JSON list
    cart_items_obj = json.loads(cart_items)
    item_id_to_qty = {item["id"]: item["qty"] for item in cart_items_obj}
    item_ids = list(item_id_to_qty.keys())

    db_gen = get_db()
    db = next(db_gen)

    from sqlalchemy import select
    # TODO: REFACTOR
    stmt = select(Item).where(Item.id.in_(item_ids))
    items = db.exec(stmt).scalars().all()

    line_items = []
    for item in items:
        qty = item_id_to_qty.get(item.id, 1)
        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {"name": item.name},
                "unit_amount": int(item.price * 100),
            },
            "quantity": qty,
        })

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=os.getenv("BASE_URL") + "/success",
            cancel_url=os.getenv("BASE_URL") + "/cancel",
            metadata={
                "user_id": str(current_user.id),
                "cart_items": cart_items,
            },
            customer_email=current_user.email,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/webhook/")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=stripe_signature, secret=STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"].get("user_id")
        cart = session["metadata"].get("cart_items", "[]")
        email = session.get("customer_email")
        amount = session["amount_total"]
        currency = session["currency"]
        order_id = session["id"]

        add_order_to_db(
            Order(
                stripe_id=order_id,
                currency=currency,
                amount=amount,
                user_id=user_id,
                email=email,
            ),
            order_items=json.loads(cart),
        )
    return {"status": "success"}
