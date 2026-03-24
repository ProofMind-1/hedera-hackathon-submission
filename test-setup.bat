@echo off
echo 🚀 ProofMind Demo Test Script
echo ==============================

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js found

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python not found. Please install Python 3.8+
        pause
        exit /b 1
    )
    set PYTHON_CMD=python3
) else (
    set PYTHON_CMD=python
)
echo ✓ Python found

:: Install dependencies
echo 📦 Installing dependencies...
call npm install --silent
cd backend
call npm install --silent
cd ..
echo ✓ Dependencies installed

echo.
echo 🎉 Setup test complete!
echo.
echo To start the demo:
echo 1. npx tsx mock-server.ts    ^(In terminal 1^)
echo 2. npm run dev               ^(In terminal 2^)
echo 3. python demo_generator.py  ^(In terminal 3^)
echo.
echo Then visit: http://localhost:5173
echo.
pause