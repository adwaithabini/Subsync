from pydantic import BaseModel, EmailStr, Field, field_validator


# User registration request
class UserRegister(BaseModel):

    full_name: str = Field(min_length=2, max_length=100)

    email: EmailStr

    password: str = Field(
        min_length=9,
        max_length=128
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:

        if not any(c.isupper() for c in password):
            raise ValueError("Password must contain an uppercase letter")

        if not any(c.islower() for c in password):
            raise ValueError("Password must contain a lowercase letter")

        if not any(c.isdigit() for c in password):
            raise ValueError("Password must contain a number")

        if not any(not c.isalnum() for c in password):
            raise ValueError("Password must contain a special character")

        return password


# User login request
class UserLogin(BaseModel):

    email: EmailStr

    password: str


# Response after successful registration
class UserResponse(BaseModel):

    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }


# Response after successful login
class TokenResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"