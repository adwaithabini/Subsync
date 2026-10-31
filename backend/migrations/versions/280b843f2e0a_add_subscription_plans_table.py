"""add subscription plans table

Revision ID: 280b843f2e0a
Revises: 29d8da8ba8fe
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '280b843f2e0a'
down_revision: Union[str, Sequence[str], None] = '29d8da8ba8fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'subscription_plans',

        sa.Column('id', sa.Integer(), nullable=False),

        sa.Column(
            'product_id',
            sa.Integer(),
            sa.ForeignKey('products.id'),
            nullable=False
        ),

        sa.Column(
            'variant_id',
            sa.Integer(),
            sa.ForeignKey('product_variants.id'),
            nullable=True
        ),

        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('billing_cycle', sa.String(length=20), nullable=False),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('minimum_quantity', sa.Integer(), nullable=False),
        sa.Column(
            'available_from',
            sa.DateTime(timezone=True),
            nullable=True
        ),
        sa.Column(
            'available_until',
            sa.DateTime(timezone=True),
            nullable=True
        ),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=True
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=True
        ),

        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        'ix_subscription_plans_id',
        'subscription_plans',
        ['id']
    )

    op.create_index(
        'ix_subscription_plans_product_id',
        'subscription_plans',
        ['product_id']
    )

    op.create_index(
        'ix_subscription_plans_variant_id',
        'subscription_plans',
        ['variant_id']
    )


def downgrade() -> None:
    op.drop_index(
        'ix_subscription_plans_variant_id',
        table_name='subscription_plans'
    )

    op.drop_index(
        'ix_subscription_plans_product_id',
        table_name='subscription_plans'
    )

    op.drop_index(
        'ix_subscription_plans_id',
        table_name='subscription_plans'
    )

    op.drop_table('subscription_plans')
