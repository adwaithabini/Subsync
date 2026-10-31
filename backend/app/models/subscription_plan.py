from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Numeric,
    ForeignKey
)
from sqlalchemy.sql import func

from app.database import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
        index=True
    )

    variant_id = Column(
        Integer,
        ForeignKey("product_variants.id"),
        nullable=True,
        index=True
    )

    name = Column(String(150), nullable=False)

    billing_cycle = Column(
        String(20),
        nullable=False
    )

    price = Column(Numeric(10, 2), nullable=False)

    minimum_quantity = Column(
        Integer,
        nullable=False,
        default=1
    )

    available_from = Column(DateTime(timezone=True), nullable=True)
    available_until = Column(DateTime(timezone=True), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )