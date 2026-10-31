from decimal import Decimal
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Data required to create a variant
class VariantCreate(BaseModel):
    product_id: int
    name: str = Field(min_length=2, max_length=150)
    description: Optional[str] = None
    sku: str = Field(min_length=2, max_length=100)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)


# Data used when updating a variant
class VariantUpdate(BaseModel):
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
    price: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2
    )
    is_active: Optional[bool] = None


# Data returned by the API
class VariantResponse(BaseModel):
    id: int
    product_id: int
    name: str
    description: Optional[str]
    sku: str
    price: Decimal
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}