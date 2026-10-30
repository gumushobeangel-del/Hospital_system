# MediLink Local Development Startup Script
# Run from repository root: powershell -ExecutionPolicy Bypass -File .\start-dev.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   MediLink Hospital Management Platform Dev Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Ensure dependencies & database migration
Write-Host "`n[1/3] Running database migrations..." -ForegroundColor Yellow
Push-Location backend
try {
    python -m alembic upgrade head
    python -m app.bootstrap_admin
} catch {
    Write-Warning "Migration or admin bootstrap warning: $_"
}
Pop-Location

Write-Host "`n[2/3] Starting backend FastAPI server on http://localhost:8000..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --port 8000" -PassThru

Write-Host "`n[3/3] Starting frontend Vite client on http://localhost:5173..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; cmd /c npm run dev" -PassThru

Write-Host "`nMediLink is running!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  - API & Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - Default Admin: admin@example.com / admin-secure-password-12345" -ForegroundColor White
Write-Host "`nClose the opened terminal windows to stop services.`n" -ForegroundColor Gray
