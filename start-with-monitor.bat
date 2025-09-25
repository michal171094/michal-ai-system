@echo off
echo 🚀 מתחיל את מערכת מיכל AI עם מוניטור...

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start server in background
echo ⚙️ מפעיל שרת ברקע...
start /b node server-clean.js

REM Wait for server to start
timeout /t 5 /nobreak >nul

REM Start monitor
echo 🔍 מפעיל מוניטור...
node monitor.js

pause