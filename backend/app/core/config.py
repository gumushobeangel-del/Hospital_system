from functools import lru_cache
from pathlib import Path
from typing import Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=PROJECT_ROOT / ".env", extra="ignore")

    secret_key: str = "medilink-super-secret-development-key-32chars-min"
    database_url: str = "sqlite:///./medilink.db"
    cookie_secure: bool = False
    cookie_max_age_seconds: int = 86400
    cors_origins: Union[list[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    medilink_admin_email: str = "admin@example.com"
    medilink_admin_password: str = "admin-secure-password-12345"

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError("SECRET_KEY must contain at least 32 characters")
        return value

    @field_validator("cookie_max_age_seconds")
    @classmethod
    def validate_cookie_lifetime(cls, value: int) -> int:
        if not 60 <= value <= 86400:
            raise ValueError("COOKIE_MAX_AGE_SECONDS must be between 60 and 86400")
        return value

    @field_validator("cors_origins", mode="after")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("[") and value.endswith("]"):
                import json
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        if isinstance(value, list):
            return [str(origin).strip() for origin in value if str(origin).strip()]
        return ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
