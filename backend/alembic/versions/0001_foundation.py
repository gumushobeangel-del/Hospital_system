"""Create MediLink foundation tables.

Revision ID: 0001_foundation
Revises:
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.types import Uuid

revision = "0001_foundation"
down_revision = None
branch_labels = None
depends_on = None

user_role = sa.Enum(
    "ADMINISTRATOR",
    "RECEPTIONIST",
    "DOCTOR",
    "NURSE",
    "PHARMACIST",
    "LABORATORY",
    "ACCOUNTANT",
    "PATIENT",
    name="userrole",
    native_enum=False,
    length=32,
)


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", Uuid(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=512), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table(
        "audit_logs",
        sa.Column("id", Uuid(as_uuid=True), nullable=False),
        sa.Column("actor_id", Uuid(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(length=80), nullable=False),
        sa.Column("resource_type", sa.String(length=80), nullable=False),
        sa.Column("resource_id", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_logs_created_at", "audit_logs", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_audit_logs_created_at", table_name="audit_logs")
    op.drop_table("audit_logs")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
