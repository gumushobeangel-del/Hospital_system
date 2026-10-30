@echo off
echo ==================================================
echo    MediLink Hospital Platform Development Setup
echo ==================================================

cd /d "%~dp0backend"
echo [1/3] Running migrations and bootstrapping administrator...
python -m alembic upgrade head
python -m app.bootstrap_admin

echo [2/3] Starting backend FastAPI server...
start "MediLink API (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload --port 8000"

echo [3/3] Starting frontend Vite dev server...
start "MediLink Web (Vite React)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo MediLink is running!
echo   - Web UI: http://localhost:5173
echo   - API Docs: http://localhost:8000/docs
echo   - Default Admin: admin@example.com / admin-secure-password-12345
echo.
pause
