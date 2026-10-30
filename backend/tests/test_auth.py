def test_login_sets_http_only_session_and_me_returns_account(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ADMIN@example.com", "password": "test-admin-password-123"},
    )

    assert response.status_code == 200
    assert response.json()["role"] == "administrator"
    assert "password" not in response.json()
    assert response.cookies.get("medilink_session")
    assert "httponly" in response.headers["set-cookie"].lower()
    assert client.get("/api/v1/auth/me").json()["email"] == "admin@example.com"


def test_invalid_credentials_have_generic_error_and_are_audited(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "incorrect-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

    unknown_account = client.post(
        "/api/v1/auth/login",
        json={"email": "unknown@example.com", "password": "incorrect-password"},
    )
    assert unknown_account.status_code == 401
    assert unknown_account.json()["detail"] == response.json()["detail"]


def test_dashboard_requires_authentication(client):
    assert client.get("/api/v1/dashboard").status_code == 401


def test_admin_can_create_user_but_clinician_cannot(client):
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "doctor@example.com", "password": "test-doctor-password-123"},
    ).status_code == 200
    forbidden = client.post(
        "/api/v1/users",
        json={
            "email": "new@example.com",
            "password": "long-enough-password",
            "role": "receptionist",
        },
    )
    assert forbidden.status_code == 403

    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "test-admin-password-123"},
    )
    created = client.post(
        "/api/v1/users",
        json={
            "email": "new@example.com",
            "password": "long-enough-password",
            "role": "receptionist",
        },
    )
    assert created.status_code == 201
    assert created.json()["email"] == "new@example.com"
    assert "password_hash" not in created.json()


def test_duplicate_email_is_conflict_and_short_password_is_rejected(client):
    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "test-admin-password-123"},
    )
    payload = {"email": "doctor@example.com", "password": "a-long-enough-password", "role": "doctor"}
    assert client.post("/api/v1/users", json=payload).status_code == 409
    payload["email"] = "other@example.net"
    payload["password"] = "short"
    assert client.post("/api/v1/users", json=payload).status_code == 422
