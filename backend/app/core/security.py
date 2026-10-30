from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from passlib.context import CryptContext

from app.core.config import Settings

password_context = CryptContext(schemes=["argon2"], deprecated="auto")
ALGORITHM = "HS256"
DUMMY_PASSWORD_HASH = password_context.hash("medilink-nonexistent-account-password")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


def create_session_token(user_id: UUID, settings: Settings) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        seconds=settings.cookie_max_age_seconds
    )
    return jwt.encode(
        {"sub": str(user_id), "exp": expires_at},
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_session_token(token: str, settings: Settings) -> UUID:
    payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    subject = payload.get("sub")
    if not isinstance(subject, str):
        raise jwt.InvalidTokenError("Session subject is missing")
    return UUID(subject)
