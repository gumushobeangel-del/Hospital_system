from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser, DbSession
from app.core.config import Settings, get_settings
from app.core.security import DUMMY_PASSWORD_HASH, create_session_token, verify_password
from app.models import AuditLog, User
from app.schemas.auth import LoginRequest, UserRead

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])


def record_auth_event(db: Session, action: str, actor_id: UUID | None = None) -> None:
    db.add(
        AuditLog(
            actor_id=actor_id,
            action=action,
            resource_type="authentication",
            resource_id=str(actor_id) if actor_id else None,
        )
    )
    db.commit()


@router.post("/login", response_model=UserRead)
def login(
    payload: LoginRequest,
    response: Response,
    db: DbSession,
    settings: Annotated[Settings, Depends(get_settings)],
) -> User:
    email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == email))
    password_hash = user.password_hash if user is not None else DUMMY_PASSWORD_HASH
    password_matches = verify_password(payload.password, password_hash)
    if user is None or not user.is_active or not password_matches:
        record_auth_event(db, "login_failed", user.id if user else None)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    response.set_cookie(
        key="medilink_session",
        value=create_session_token(user.id, settings),
        httponly=True,
        secure=settings.cookie_secure,
        samesite="strict",
        max_age=settings.cookie_max_age_seconds,
        path="/",
    )
    record_auth_event(db, "login_succeeded", user.id)
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie(key="medilink_session", path="/", httponly=True, samesite="strict")


@router.get("/me", response_model=UserRead)
def me(user: CurrentUser) -> User:
    return user
