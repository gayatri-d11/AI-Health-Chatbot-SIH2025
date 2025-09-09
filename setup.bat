@echo off
echo Setting up Health Chatbot locally...

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies  
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Setup Python environment for Rasa
echo Setting up Rasa...
python -m venv rasa-env
call rasa-env\Scripts\activate
pip install rasa==3.6.0
pip install rasa[transformers]

echo Setup complete! Run start.bat to launch all services.
pause