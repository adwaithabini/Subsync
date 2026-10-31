from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.dependencies import get_db, require_roles
from app.roles import UserRole
from app.models import Product, ProductVariant, SubscriptionPlan
from app.schemas.subscription_plan import (
    SubscriptionPlanCreate,
    SubscriptionPlanUpdate,
    SubscriptionPlanResponse
)

router = APIRouter(
    prefix="/subscription-plans",
    tags=["Subscription Plans"]
)


# CREATE SUBSCRIPTION PLAN
@router.post(
    "/",
    response_model=SubscriptionPlanResponse,
    status_code=status.HTTP_201_CREATED
)
def create_subscription_plan(
    plan_data: SubscriptionPlanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    product = db.query(Product).filter(
        Product.id == plan_data.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Active product not found"
        )

    if plan_data.variant_id is not None:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == plan_data.variant_id,
            ProductVariant.product_id == plan_data.product_id,
            ProductVariant.is_active == True
        ).first()

        if not variant:
            raise HTTPException(
                status_code=404,
                detail="Active variant not found for this product"
            )

    plan = SubscriptionPlan(**plan_data.model_dump())

    try:
        db.add(plan)
        db.commit()
        db.refresh(plan)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Could not create subscription plan"
        )

    return plan


# GET ALL ACTIVE SUBSCRIPTION PLANS
@router.get("/", response_model=list[SubscriptionPlanResponse])
def get_subscription_plans(
    db: Session = Depends(get_db)
):
    return db.query(SubscriptionPlan).filter(
        SubscriptionPlan.is_active == True
    ).all()


# GET PLANS FOR A PARTICULAR PRODUCT
@router.get(
    "/product/{product_id}",
    response_model=list[SubscriptionPlanResponse]
)
def get_product_subscription_plans(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Active product not found"
        )

    return db.query(SubscriptionPlan).filter(
        SubscriptionPlan.product_id == product_id,
        SubscriptionPlan.is_active == True
    ).all()


# GET A PARTICULAR SUBSCRIPTION PLAN
@router.get("/{plan_id}", response_model=SubscriptionPlanResponse)
def get_subscription_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == plan_id,
        SubscriptionPlan.is_active == True
    ).first()

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Subscription plan not found"
        )

    return plan


# UPDATE SUBSCRIPTION PLAN
@router.put("/{plan_id}", response_model=SubscriptionPlanResponse)
def update_subscription_plan(
    plan_id: int,
    plan_data: SubscriptionPlanUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == plan_id,
        SubscriptionPlan.is_active == True
    ).first()

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Subscription plan not found"
        )

    updates = plan_data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    # Prevent null values in required database columns
    required_fields = {
        "name",
        "billing_cycle",
        "price",
        "minimum_quantity"
    }

    for field in required_fields:
        if field in updates and updates[field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null"
            )

    # Validate the final availability date range
    new_from = updates.get("available_from", plan.available_from)
    new_until = updates.get("available_until", plan.available_until)

    if (
        new_from is not None
        and new_until is not None
        and new_from >= new_until
    ):
        raise HTTPException(
            status_code=422,
            detail="available_until must be later than available_from"
        )

    for field, value in updates.items():
        setattr(plan, field, value)

    try:
        db.commit()
        db.refresh(plan)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Could not update subscription plan"
        )

    return plan


# DELETE SUBSCRIPTION PLAN (SOFT DELETE)
@router.delete("/{plan_id}")
def delete_subscription_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR)
    )
):
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == plan_id,
        SubscriptionPlan.is_active == True
    ).first()

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Subscription plan not found"
        )

    plan.is_active = False
    db.commit()

    return {
        "message": "Subscription plan deactivated successfully"
    }