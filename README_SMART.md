# 🤖 מערכת העוזר החכם של מיכל

מערכת AI מתקדמת לניהול משימות אקדמיות, חובות ובירוקרטיה עם זרם עבודה חכם מבוסס LangGraph.

## ✨ תכונות מרכזיות

- 🧠 **סוכן חכם מבוסס LangGraph** - זרם עבודה מתקדם של 6 שלבים
- 📚 **ניהול משימות אקדמיות** - לקוחות, תזות, סמינרים ופרויקטים
- 💰 **ניהול חובות** - התנגדויות, מעקב תשלומים, חברות גביה
- 🏛️ **ניהול בירוקרטיה** - רשויות גרמניות, ביטוח בריאות, רישומים
- 💬 **צ'אט חכם** - תגובות מותאמות אישית עם הקשר
- 📱 **ממשק עברי RTL** - עיצוב מותאם לעברית

## 🏗️ ארכיטקטורה

המערכת מורכבת משני שרתים:

1. **שרת ממשק (Node.js)** - פורט 3000
   - ממשק משתמש עברי
   - API endpoints בסיסיים
   - גשר לשרת AI

2. **שרת AI חכם (Python)** - פורט 8000  
   - LangGraph workflow engine
   - עיבוד שפה טבעית
   - ניתוח הקשר והחלטות

## 🚀 הפעלה מהירה

### דרך 1: סקריפט אוטומטי (מומלץ)
```batch
start-smart.bat
```

### דרה 2: הפעלה ידנית

1. **התקנת תלויות Node.js:**
```bash
npm install
```

2. **הפעלת סביבת Python:**
```bash
# יצירת סביבה וירטואלית
python -m venv venv
venv\Scripts\activate

# התקנת חבילות
pip install fastapi uvicorn langgraph langchain langchain-openai python-dotenv
```

3. **הגדרת מפתח OpenAI (אופציונלי):**
```bash
# עריכת קובץ ai_agent\.env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **הפעלת השרתים:**
```bash
# טרמינל 1: שרת AI 
python ai_agent/smart_server.py

# טרמינל 2: שרת ממשק
node simple-server.js
```

5. **פתיחה בדפדפן:**
- ממשק משתמש: http://localhost:3000
- תיעוד API: http://localhost:8000/docs

## 🔧 הגדרות

### קובץ `.env` (ai_agent\.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini

# Server Settings
HOST=localhost
PORT=8000
DEBUG=true
```

## 📚 מדריך שימוש

### צ'אט חכם
המערכת תומכת בשאלות כמו:
- "מה דחוף היום?"
- "איך אני עונה ל-PAIR Finance?"
- "מה המצב עם הבירוקרטיה?"
- "הכן טיוטת מייל ל-TK"

### ניהול נתונים
הנתונים נשמרים זמנית בזיכרון. בעתיד יתמכו:
- מסד נתונים מתמשך
- סנכרון ענן
- גיבוי אוטומטי

### תבניות מוכנות
המערכת כוללת תבניות מוכנות עבור:
- מכתבי התנגדות לחברות גביה
- בקשות למסמכים רשמיים
- תכתובת עם רשויות

## 🤖 זרם העבודה החכם (LangGraph)

1. **Intake** - קליטת השאלה וזיהוי ראשוני
2. **Analyze** - ניתוח תוכן וחילוץ ישויות
3. **Research** - חיפוש מידע רלוונטי מבסיס הנתונים
4. **Draft** - יצירת טיוטת תגובה מותאמת
5. **Review** - בדיקה ובקרת איכות
6. **Execute** - ביצוע והחזרת התגובה הסופית

## 🛠️ פיתוח

### מצב פיתוח ללא OpenAI
המערכת יכולה לפעול ללא API key של OpenAI עם תגובות מוכנות מראש.

### הוספת תכונות חדשות

1. **עריכת הסוכן החכם:**
   - `ai_agent/michal_agent.py` - לוגיקת הסוכן
   - `ai_agent/smart_server.py` - API endpoints

2. **עריכת הממשק:**
   - `app.js` - לוגיקת צד לקוח
   - `style.css` - עיצוב עברי RTL
   - `index.html` - מבנה HTML

3. **עריכת השרת:**
   - `simple-server.js` - API routes
   - `package.json` - תלויות

### בדיקות
```bash
# בדיקת בריאות השרתים
curl http://localhost:3000/api/health
curl http://localhost:8000/health

# בדיקת צ'אט
curl -X POST http://localhost:3000/api/chat/smart \
  -H "Content-Type: application/json" \
  -d '{"message": "מה דחוף היום?", "context": {}}'
```

## 📝 TODO - תכונות עתידיות

- [ ] מסד נתונים מתמשך (SQLite/PostgreSQL)
- [ ] אימות משתמשים ואבטחה
- [ ] יצוא לExcel/PDF
- [ ] שילוב Gmail API
- [ ] שילוב WhatsApp Business API
- [ ] OCR למסמכים סרוקים
- [ ] תזכורות אוטומטיות
- [ ] דוחות ואנליטיקה
- [ ] גיבוי ענן
- [ ] אפליקציה ניידת

## 🐛 פתרון בעיות

### שרת לא מגיב
```bash
# בדיקת פורטים
netstat -an | findstr :3000
netstat -an | findstr :8000
```

### שגיאות Python
```bash
# בדיקת התקנה
pip list | findstr fastapi
pip list | findstr langgraph
```

### שגיאות Node.js
```bash
# בדיקת גרסה
node --version
npm --version

# התקנה מחדש
npm install
```

## 🤝 תרומה

המערכת בפיתוח פעיל. תרומות מתקבלות בברכה!

## 📄 רישיון

MIT License - ראה קובץ LICENSE לפרטים

---

**מיכל AI Assistant v1.0** - נוצר עם ❤️ ו-LangGraph