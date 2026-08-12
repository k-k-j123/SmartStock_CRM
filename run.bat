@echo off
echo Starting All Services...

REM 1 & 2 - Start Analytics Service
start "Analytics Service" cmd /k "cd /d %~dp0Analytics-Service && uvicorn app.main:app --port 8000"

REM 3 & 4 - Start Backend
start "Backend Service" cmd /k "cd /d %~dp0Backend && mvnw spring-boot:run"

REM 5 & 6 - Start Frontend
start "Frontend Service" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo All services started.
pause