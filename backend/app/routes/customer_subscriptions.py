from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_db, get_current_user, require_roles
from app.roles import UserRole
from app.models import SubscriptionPlan, CustomerSubscription
from app.schemas.customer_subscription import (
    CustomerSubscriptionCreate,
    CustomerSubscriptionResponse
)

router = APIRouter(
    prefix="/customer-subscriptions",
    tags=["Customer Subscriptions"]
)


def calculate_end_date(start, cycle):
    if cycle == "daily":
        from datetime import timedelta
        return start + timedelta(days=1)
    if cycle == "weekly":
        from datetime import timedelta
        return start + timedelta(weeks=1)
    if cycle == "monthly":
        return start + relativedelta(months=1)
    if cycle == "annual":
        return start + relativedelta(years=1)
    raise HTTPException(400, "Invalid billing cycle")


# CREATE SUBSCRIPTION
@router.post("/", response_model=CustomerSubscriptionResponse)
def create_subscription(
    data: CustomerSubscriptionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == data.plan_id,
        SubscriptionPlan.is_active == True
    ).first()

    if not plan:
        raise HTTPException(404, "Active subscription plan not found")

    if data.quantity < plan.minimum_quantity:
        raise HTTPException(
            400,
            f"Minimum quantity is {plan.minimum_quantity}"
        )

    now = datetime.now(timezone.utc)

    if plan.available_from and now < plan.available_from:
        raise HTTPException(400, "Plan is not available yet")

    if plan.available_until and now > plan.available_until:
        raise HTTPException(400, "Plan availability has ended")

    end_date = calculate_end_date(now, plan.billing_cycle)

    subscription = CustomerSubscription(
        user_id=user.id,
        plan_id=plan.id,
        quantity=data.quantity,
        unit_price=plan.price,
        billing_cycle=plan.billing_cycle,
        status="active",
        start_date=now,
        current_period_start=now,
        current_period_end=end_date,
        next_billing_date=end_date
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


# VIEW MY SUBSCRIPTIONS
@router.get("/", response_model=list[CustomerSubscriptionResponse])
def get_my_subscriptions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(CustomerSubscription).filter(
        CustomerSubscription.user_id == user.id
    ).all()


# VIEW ONE SUBSCRIPTION
@router.get("/{subscription_id}", response_model=CustomerSubscriptionResponse)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    subscription = db.query(CustomerSubscription).filter(
        CustomerSubscription.id == subscription_id,
        CustomerSubscription.user_id == user.id
    ).first()

    if not subscription:
        raise HTTPException(404, "Subscription not found")

    return subscription


# CANCEL SUBSCRIPTION
@router.patch("/{subscription_id}/cancel")
def cancel_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    subscription = db.query(CustomerSubscription).filter(
        CustomerSubscription.id == subscription_id,
        CustomerSubscription.user_id == user.id
    ).first()

    if not subscription:
        raise HTTPException(404, "Subscription not found")

    if subscription.status != "active":
        raise HTTPException(400, "Subscription is not active")

    subscription.status = "cancelled"
    subscription.canceled_at = datetime.now(timezone.utc)
    subscription.next_billing_date = None

    db.commit()

    return {"message": "Subscription cancelled successfully"}