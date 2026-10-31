from fastapi import FastAPI

app = FastAPI(
    title="Subsync API",
    description="Subscription and Billing Management System",
    version="1.0.0"
)


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