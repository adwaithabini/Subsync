from sqlalchemy import (
    Column, Integer, String, Numeric,
    DateTime, ForeignKey
)
from sqlalchemy.sql import func

from app.database import Base


class Billing(Base):
    __tablename__ = "billings"

    id = Column(Integer, primary_key=True, index=True)

    subscription_id = Column(
        Integer,
        ForeignKey("customer_subscriptions.id"),
        nullable=False,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    invoice_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    amount = Column(Numeric(10, 2), nullable=False)

    billing_period_start = Column(DateTime(timezone=True), nullable=False)
    billing_period_end = Column(DateTime(timezone=True), nullable=False)

    payment_status = Column(
        String(20),
        nullable=False,
        default="pending",
        server_default="pending"
    )

    payment_method = Column(String(50), nullable=True)

    paid_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )