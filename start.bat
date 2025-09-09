@echo off
echo Starting Health Chatbot services...

REM Start PostgreSQL (if using local)
echo Starting database...
start "PostgreSQL" cmd /k "echo PostgreSQL should be running on port 5432"

REM Start Rasa server
echo Starting Rasa NLU server...
start "Rasa" cmd /k "cd rasa && call ..\rasa-env\Scripts\activate && rasa run --enable-api --cors * --port 5005"

REM Wait for Rasa to start
timeout /t 10

REM Start backend API
echo Starting backend API...
start "Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 5

REM Start frontend
echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo All services starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3000
echo Rasa NLU: http://localhost:5005
pause