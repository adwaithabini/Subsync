from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Data required to create a product
class ProductCreate(BaseModel):

    name: str = Field(min_length=2, max_length=150)

    description: Optional[str] = None

    sku: str = Field(min_length=2, max_length=100)

    category: Optional[str] = None


# Data used when updating a product
class ProductUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    description: Optional[str] = None

    sku: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    category: Optional[str] = None

    is_active: Optional[bool] = None


# Product details returned by the API
class ProductResponse(BaseModel):

    id: int
    name: str
    description: Optional[str]
    sku: str
    category: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {
        "from_attributes": True
    }