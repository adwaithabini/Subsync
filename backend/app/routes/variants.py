from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.dependencies import get_db, require_roles
from app.models import Product, ProductVariant
from app.schemas.variant import (
    VariantCreate,
    VariantUpdate,
    VariantResponse
)
from app.roles import UserRole

router = APIRouter(prefix="/variants", tags=["Product Variants"])


# Create a variant (Admin or Staff)
@router.post(
    "/",
    response_model=VariantResponse,
    status_code=status.HTTP_201_CREATED
)
def create_variant(
    variant_data: VariantCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    product = db.query(Product).filter(
        Product.id == variant_data.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Active product not found"
        )

    existing_variant = db.query(ProductVariant).filter(
        ProductVariant.sku == variant_data.sku
    ).first()

    if existing_variant:
        raise HTTPException(
            status_code=409,
            detail="Variant SKU already exists"
        )

    new_variant = ProductVariant(**variant_data.model_dump())

    db.add(new_variant)

    try:
        db.commit()
        db.refresh(new_variant)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Variant SKU already exists"
        )

    return new_variant


# Get all active variants
@router.get("/", response_model=list[VariantResponse])
def get_variants(db: Session = Depends(get_db)):
    return db.query(ProductVariant).filter(
        ProductVariant.is_active == True
    ).all()


# Get variants belonging to a product
@router.get(
    "/product/{product_id}",
    response_model=list[VariantResponse]
)
def get_product_variants(
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
            detail="Product not found"
        )

    return db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.is_active == True
    ).all()


# Get a variant by ID
@router.get("/{variant_id}", response_model=VariantResponse)
def get_variant(
    variant_id: int,
    db: Session = Depends(get_db)
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id,
        ProductVariant.is_active == True
    ).first()

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found"
        )

    return variant


# Update a variant (Admin or Staff)
@router.put("/{variant_id}", response_model=VariantResponse)
def update_variant(
    variant_id: int,
    variant_data: VariantUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id
    ).first()

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found"
        )

    update_data = variant_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No update fields provided"
        )

    if "sku" in update_data:
        existing_variant = db.query(ProductVariant).filter(
            ProductVariant.sku == update_data["sku"],
            ProductVariant.id != variant_id
        ).first()

        if existing_variant:
            raise HTTPException(
                status_code=409,
                detail="Variant SKU already exists"
            )

    for field, value in update_data.items():
        setattr(variant, field, value)

    try:
        db.commit()
        db.refresh(variant)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Variant SKU already exists"
        )

    return variant


# Deactivate a variant (Admin only)
@router.delete("/{variant_id}")
def deactivate_variant(
    variant_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR)
    )
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id
    ).first()

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found"
        )

    variant.is_active = False
    db.commit()

    return {
        "message": "Variant deactivated successfully"
    }