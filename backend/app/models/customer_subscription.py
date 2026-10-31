from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Numeric,
    ForeignKey
)
from sqlalchemy.sql import func

from app.database import Base


class CustomerSubscription(Base):
    __tablename__ = "customer_subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    # Customer who owns this subscription
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Selected subscription plan
    plan_id = Column(
        Integer,
        ForeignKey("subscription_plans.id"),
        nullable=False,
        index=True
    )

    # Snapshot of the price and billing cycle at subscription time
    quantity = Column(Integer, nullable=False, default=1)

    unit_price = Column(Numeric(10, 2), nullable=False)

    billing_cycle = Column(String(20), nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="active",
        server_default="active"
    )

    start_date = Column(
        DateTime(timezone=True),
        nullable=False
    )

    current_period_start = Column(
        DateTime(timezone=True),
        nullable=False
    )

    current_period_end = Column(
        DateTime(timezone=True),
        nullable=False
    )

    next_billing_date = Column(
        DateTime(timezone=True),
        nullable=True
    )

    canceled_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )