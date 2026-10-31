from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_roles
from app.roles import UserRole
from app.models import Billing, CustomerSubscription
from app.schemas.billing import (
    BillingPaymentUpdate,
    BillingResponse
)

router = APIRouter(prefix="/billing", tags=["Billing"])


# CREATE BILLING RECORD / INVOICE
@router.post("/", response_model=BillingResponse)
def create_billing(
    subscription_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF))
):
    subscription = db.query(CustomerSubscription).filter(
        CustomerSubscription.id == subscription_id
    ).first()

    if not subscription:
        raise HTTPException(404, "Subscription not found")

    amount = subscription.unit_price * subscription.quantity

    billing = Billing(
        subscription_id=subscription.id,
        user_id=subscription.user_id,
        invoice_number=f"INV-{uuid4().hex[:10].upper()}",
        amount=amount,
        billing_period_start=subscription.current_period_start,
        billing_period_end=subscription.current_period_end,
        payment_status="pending"
    )

    db.add(billing)
    db.commit()
    db.refresh(billing)

    return billing


# VIEW MY INVOICES
@router.get("/my-invoices", response_model=list[BillingResponse])
def get_my_invoices(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Billing).filter(
        Billing.user_id == user.id
    ).order_by(Billing.created_at.desc()).all()


# VIEW ALL BILLING RECORDS (ADMIN/STAFF)
@router.get("/", response_model=list[BillingResponse])
def get_all_billing(
    db: Session = Depends(get_db),
    user=Depends(require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF))
):
    return db.query(Billing).order_by(
        Billing.created_at.desc()
    ).all()


# UPDATE PAYMENT STATUS
@router.patch("/{billing_id}/payment", response_model=BillingResponse)
def update_payment_status(
    billing_id: int,
    data: BillingPaymentUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF))
):
    billing = db.query(Billing).filter(
        Billing.id == billing_id
    ).first()

    if not billing:
        raise HTTPException(404, "Billing record not found")

    if data.payment_status not in ["pending", "paid", "failed"]:
        raise HTTPException(
            400,
            "Payment status must be pending, paid, or failed"
        )

    billing.payment_status = data.payment_status
    billing.payment_method = data.payment_method

    if data.payment_status == "paid":
        billing.paid_at = datetime.now(timezone.utc)
    else:
        billing.paid_at = None

    db.commit()
    db.refresh(billing)

    return billing