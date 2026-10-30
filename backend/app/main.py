from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api import auth, dashboard, users
from app.core.config import get_settings
from app.db.session import engine


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title="MediLink API",
        version="0.1.0",
        description="Stage 1 foundation. No clinical workflows are implemented.",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
    )
    application.include_router(auth.router)
    application.include_router(users.router)
    application.include_router(dashboard.router)

    @application.get("/health", tags=["system"])
    def health() -> dict[str, str]:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        except SQLAlchemyError as exc:
            raise HTTPException(status_code=503, detail="Database unavailable") from exc
        return {"status": "ok"}

    return application


app = create_app()
