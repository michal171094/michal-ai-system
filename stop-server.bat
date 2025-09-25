@echo off
echo 🛑 עוצר את שרת מיכל AI...

REM Kill Node processes gracefully
taskkill /f /im node.exe >nul 2>&1

echo ✅ השרת נעצר בהצלחה!
pause