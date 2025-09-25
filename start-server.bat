@echo off
echo 🚀 מתחיל את שרת מיכל AI...

REM Kill any existing Node processes
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start the server
echo ⏰ מפעיל שרת...
node server-clean.js

pause