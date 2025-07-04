from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from contextlib import asynccontextmanager
from .routers import items, users, orders, admin
from fastapi.responses import RedirectResponse
from .models import User
from .auth import get_current_user
import os
from dotenv import load_dotenv
import stripe

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")



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
    #TODO: check if user email is verified before 
    cartItems = await request.json()
    print(cartItems)
    line_items = [
        {
            "price_data": {
                "currency": "usd",
                "product_data": {"name": item["name"]},
                "unit_amount": int(item["price"] * 100),
            },
            "quantity": item["quantity"],
        }
        for item in cartItems
    ]
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=os.getenv("BASE_URL") + "/success",
            cancel_url=os.getenv("BASE_URL") + "/cancel",
            metadata={"user_id": str(current_user.id)},
            customer_email=current_user.email,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/webhook/")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception as e:
        print("Webhook error:", e)
        raise HTTPException(status_code=400, detail="Invalid webhook")
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # session["metadata"]["user_id"] , create in DB
        # Save order send email etc.
    return {"status": "success"}
