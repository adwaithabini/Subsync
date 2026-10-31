from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class BillingCreate(BaseModel):
    subscription_id: int


class BillingPaymentUpdate(BaseModel):
    payment_status: str
    payment_method: Optional[str] = None


class BillingResponse(BaseModel):
    id: int
    subscription_id: int
    user_id: int
    invoice_number: str
    amount: Decimal
    billing_period_start: datetime
    billing_period_end: datetime
    payment_status: str
    payment_method: Optional[str]
    paid_at: Optional[datetime]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}