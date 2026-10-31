import os
import jwt

from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash


# Password hashing configuration
password_hash = PasswordHash.recommended()


# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is missing from environment variables")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Hash a user's password
def hash_password(password: str) -> str:
    return password_hash.hash(password)


# Verify a password during login
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(plain_password, hashed_password)


# Generate JWT access token
def create_access_token(user_id: int, role: str) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token