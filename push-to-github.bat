@echo off
echo דוחף קוד ל-GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ הקוד נדחף בהצלחה!
    echo 🚀 GitHub Actions יתחיל לרוץ עכשיו
    echo.
    echo פתח את הקישור הזה לראות את הבנייה:
    echo https://github.com/USERNAME/michal-ai-system/actions
    echo.
    echo אחר כך תוכל לעשות deploy ב-Render!
) else (
    echo ❌ שגיאה בדחיפה. ודא שיצרת repository ב-GitHub
    echo לך ל: https://github.com/new
)

pause