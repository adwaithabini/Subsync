from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.dependencies import get_db, require_roles
from app.models import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)
from app.roles import UserRole

router = APIRouter(prefix="/products", tags=["Products"])


# Create a product (Admin or Staff)
@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    existing_product = db.query(Product).filter(
        Product.sku == product_data.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

    new_product = Product(**product_data.model_dump())

    db.add(new_product)

    try:
        db.commit()
        db.refresh(new_product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

    return new_product


# Get all active products
@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(
        Product.is_active == True
    ).all()


# Get a product by ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Update a product (Admin or Staff)
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR, UserRole.STAFF)
    )
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No update fields provided"
        )

    if "sku" in update_data:
        existing_product = db.query(Product).filter(
            Product.sku == update_data["sku"],
            Product.id != product_id
        ).first()

        if existing_product:
            raise HTTPException(
                status_code=409,
                detail="SKU already exists"
            )

    for field, value in update_data.items():
        setattr(product, field, value)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="SKU already exists"
        )

    return product


# Deactivate a product (Admin only)
@router.delete("/{product_id}")
def deactivate_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMINISTRATOR)
    )
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = False
    db.commit()

    return {
        "message": "Product deactivated successfully"
    }