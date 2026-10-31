from decimal import Decimal
from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field, model_validator


# Supported billing cycles
class BillingCycle(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    ANNUAL = "annual"


# Data required to create a subscription plan
class SubscriptionPlanCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None

    name: str = Field(min_length=2, max_length=150)

    billing_cycle: BillingCycle

    price: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2
    )

    minimum_quantity: int = Field(default=1, ge=1)

    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None

    @model_validator(mode="after")
    def validate_availability(self):
        if (
            self.available_from is not None
            and self.available_until is not None
            and self.available_from >= self.available_until
        ):
            raise ValueError(
                "available_until must be later than available_from"
            )

        return self


# Data used when updating a subscription plan
class SubscriptionPlanUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    billing_cycle: Optional[BillingCycle] = None

    price: Optional[Decimal] = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2
    )

    minimum_quantity: Optional[int] = Field(
        default=None,
        ge=1
    )

    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    is_active: Optional[bool] = None


# Data returned by the API
class SubscriptionPlanResponse(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int]

    name: str
    billing_cycle: str
    price: Decimal
    minimum_quantity: int

    available_from: Optional[datetime]
    available_until: Optional[datetime]

    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}