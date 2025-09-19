@echo off
echo ========================================
echo   AI Health Chatbot - Setup & Run
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Starting Backend Server...
cd ..\backend
start "Backend Server" cmd /k "npm start"

echo.
echo [4/4] Starting Frontend Development Server...
cd ..\frontend
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend running on: http://localhost:3000
echo Frontend running on: http://localhost:3001
echo.
echo Demo Credentials:
echo User: user@demo.com / demo123
echo Admin: admin@demo.com / admin123
echo.
echo Press any key to exit...
pause > nul