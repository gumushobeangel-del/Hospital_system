from fastapi import APIRouter

from app.api.dependencies import CurrentUser

router = APIRouter(prefix="/api/v1", tags=["dashboard"])


@router.get("/dashboard")
def dashboard(user: CurrentUser) -> dict[str, str | list[str]]:
    return {
        "stage": "foundation",
        "message": "Authentication and role-aware navigation are available. Clinical workflows are not yet implemented.",
        "role": user.role.value,
        "available_modules": ["dashboard", "account"],
    }
