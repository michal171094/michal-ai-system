@echo off
echo מפעיל מערכת עוזר AI חכמה למיכל...
echo.

REM בדיקת Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [שגיאה] Node.js לא מותקן במערכת
    pause
    exit /b 1
)

REM בדיקת Python
py --version >nul 2>&1
if errorlevel 1 (
    echo [שגיאה] Python לא מותקן במערכת
    pause
    exit /b 1
)

echo ✅ Node.js זמין
echo ✅ Python זמין
echo.

REM בדיקת תלויות Node.js
if not exist "node_modules" (
    echo התקנת תלויות Node.js...
    npm install
)

REM בדיקת סביבת Python
if not exist "venv" (
    echo יוצר סביבת Python...
    py -m venv venv
)

REM הפעלת סביבת Python והתקנת חבילות
echo מכין סביבת Python...
call venv\Scripts\activate.bat
pip install --quiet fastapi uvicorn langgraph langchain langchain-openai python-dotenv

echo.
echo 🚀 מפעיל שני שרתים:
echo    📊 ממשק ראשי: http://localhost:3000
echo    🤖 סוכן חכם: http://localhost:8000
echo.

REM הפעלת הסוכן החכם ברקע
echo מפעיל סוכן חכם...
start /b py ai_agent\smart_server.py

REM המתנה קצרה לסוכן החכם
timeout /t 3 /nobreak >nul

REM הפעלת השרת הראשי
echo מפעיל ממשק ראשי...
echo.
echo ✨ המערכת מוכנה! פתח דפדפן: http://localhost:3000
echo 🛑 לעצירה: לחץ Ctrl+C
echo.

npm start

pause