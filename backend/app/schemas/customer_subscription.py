from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class CustomerSubscriptionCreate(BaseModel):
    plan_id: int
    quantity: int = Field(default=1, ge=1)


class CustomerSubscriptionUpdate(BaseModel):
    quantity: Optional[int] = Field(default=None, ge=1)


class CustomerSubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan_id: int
    quantity: int
    unit_price: Decimal
    billing_cycle: str
    status: str
    start_date: datetime
    current_period_start: datetime
    current_period_end: datetime
    next_billing_date: Optional[datetime]
    canceled_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}