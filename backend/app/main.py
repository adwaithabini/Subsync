from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine,Base
from app.models import User
from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.variants import router as variants_router
from app.routes.subscription_plans import router as subscription_plans_router

app = FastAPI(
    title="Subsync API",
    description="Subscription and Billing Management System",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(variants_router)
app.include_router(subscription_plans_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to Subsync API",
        "project": "Subscription and Billing Management System",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.get("/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "message": "Neon PostgreSQL connected successfully!"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }