from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.dependencies import DbSession, require_roles
from app.core.security import hash_password
from app.models import AuditLog, User, UserRole
from app.schemas.auth import UserCreate, UserRead

router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
    dependencies=[Depends(require_roles(UserRole.ADMINISTRATOR))],
)


@router.get("", response_model=list[UserRead])
def list_users(db: DbSession) -> list[User]:
    return list(db.scalars(select(User).order_by(User.created_at.desc())).all())


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: DbSession,
    actor: User = Depends(require_roles(UserRole.ADMINISTRATOR)),
) -> User:
    user = User(
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    try:
        db.flush()
        db.add(
            AuditLog(
                actor_id=actor.id,
                action="user_created",
                resource_type="user",
                resource_id=str(user.id),
            )
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists") from exc
    db.refresh(user)
    return user
