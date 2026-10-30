import os

from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import AuditLog, User, UserRole


def main() -> None:
    settings = get_settings()
    raw_email = os.environ.get("MEDILINK_ADMIN_EMAIL") or settings.medilink_admin_email
    password = os.environ.get("MEDILINK_ADMIN_PASSWORD") or settings.medilink_admin_password
    try:
        email = str(TypeAdapter(EmailStr).validate_python(raw_email)).lower()
    except ValidationError as exc:
        raise SystemExit("Set MEDILINK_ADMIN_EMAIL to a valid email address") from exc
    if len(password) < 12 or len(password) > 128:
        raise SystemExit("MEDILINK_ADMIN_PASSWORD must contain between 12 and 128 characters")

    with SessionLocal() as db:
        if db.scalar(select(User.id).where(User.email == email)) is not None:
            print(f"Administrator account already exists: {email}")
            return
        user = User(
            email=email,
            password_hash=hash_password(password),
            role=UserRole.ADMINISTRATOR,
        )
        db.add(user)
        db.flush()
        db.add(
            AuditLog(
                actor_id=user.id,
                action="administrator_bootstrapped",
                resource_type="user",
                resource_id=str(user.id),
            )
        )
        db.commit()
    print(f"Administrator account created: {email}")


if __name__ == "__main__":
    main()
