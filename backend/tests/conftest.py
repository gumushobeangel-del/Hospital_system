import os

os.environ.setdefault("SECRET_KEY", "test-only-secret-key-with-at-least-32-characters")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models import User, UserRole
from app.core.security import hash_password


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.create_all(bind=engine)
    app = create_app()

    def override_get_db():
        with TestingSession() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestingSession() as db:
        db.add_all(
            [
                User(
                    email="admin@example.com",
                    password_hash=hash_password("test-admin-password-123"),
                    role=UserRole.ADMINISTRATOR,
                ),
                User(
                    email="doctor@example.com",
                    password_hash=hash_password("test-doctor-password-123"),
                    role=UserRole.DOCTOR,
                ),
            ]
        )
        db.commit()

    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
