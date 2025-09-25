@echo off
echo ==============================
echo   מערכת מיכל החכמה - הפעלה   
echo ==============================
echo.

echo 📋 בדיקת דרישות...

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js לא מותקן. אנא התקן Node.js מ: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is available  
py --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python לא מותקן. אנא התקן Python מ: https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js ו-Python זמינים
echo.

REM Install Node.js dependencies if needed
if not exist node_modules (
    echo 📦 מתקין תלויות Node.js...
    npm install
    echo.
)

echo 🔧 בודק סביבת Python...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo 🐍 יוצר סביבה וירטואלית...
    py -m venv venv
    echo.
)

REM Install Python packages if needed
echo 📦 מוודא שהחבילות מותקנות...
venv\Scripts\pip.exe install -q fastapi uvicorn langgraph langchain langchain-openai python-dotenv

echo 🧠 מפעיל שרת AI חכם (פורט 8000)...
start "מיכל AI Agent" cmd /k "venv\Scripts\python.exe ai_agent\smart_server.py"

echo ⏳ ממתין לטעינת השרת החכם...
timeout /t 3 /nobreak >nul

echo 🌐 מפעיל שרת ממשק (פורט 3000)...
start "מיכל Web Server" cmd /k "node simple-server.js"

echo.
echo ✅ שני השרתים מופעלים!
echo.
echo 🌐 ממשק המשתמש: http://localhost:3000
echo 🧠 שרת AI: http://localhost:8000
echo 📚 תיעוד API: http://localhost:8000/docs
echo.
echo 💡 עצה: פתחי את http://localhost:3000 בדפדפן והתחילי לעבוד!
echo.
echo 🛑 לסגירת השרתים: סגרי את החלונות או לחצי Ctrl+C בכל אחד
echo.
pause