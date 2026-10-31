from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# User registration
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role="customer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# User login
@router.post("/login", response_model=TokenResponse)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user or not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account is inactive"
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }