"""
FastAPI server למערכת העוזר החכם של מיכל
מתחבר לסוכן החכם (LangGraph) ומחזיר תגובות חכמות
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ייבוא הסוכן החכם
try:
    from .michal_agent import MichalAIAgent
    print("✅ ייבוא MichalAIAgent הצליח")
except ImportError as e:
    print(f"⚠️ שגיאה בייבוא: {e}")
    MichalAIAgent = None

# יצירת האפליקציה
app = FastAPI(
    title="מיכל AI Agent API", 
    description="API עבור העוזר החכם של מיכל",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# הגדרת CORS
def get_allowed_origins() -> List[str]:
    env_origins = os.getenv("ALLOWED_ORIGINS")
    if env_origins:
        return [origin.strip() for origin in env_origins.split(",") if origin.strip()]
    return ["http://localhost:3000", "http://127.0.0.1:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# יצירת instance גלובלי של הסוכן החכם
smart_agent = None
try:
    if MichalAIAgent:
        smart_agent = MichalAIAgent()
        print("✅ סוכן חכם נוצר בהצלחה")
    else:
        print("⚠️ MichalAIAgent לא זמין - מפעיל במצב fallback")
except Exception as e:
    print(f"⚠️ שגיאה ביצירת הסוכן: {e}")
    smart_agent = None

# מודלים של בקשות
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}

class AnalyzeRequest(BaseModel):
    text: str
    task_type: Optional[str] = None

class SuggestRequest(BaseModel):
    scenario: str
    recipient: str
    context: Optional[Dict[str, Any]] = {}

# פונקציות עזר
def get_fallback_response(message: str, context: Dict = None) -> Dict[str, Any]:
    """תגובה בסיסית כשהסוכן החכם לא זמין"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["pair", "חוב", "התנגדות"]):
        return {
            "response": """🚫 PAIR Finance - מדריך התנגדות:

1. **לא להודות בחוב** - גם לא חלקית
2. **לדרוש הוכחות מפורטות:**
   - חוזה מקורי חתום
   - היסטוריית תשלומים
   - העברת החוב (אם רלוונטי)
3. **לשלוח התנגדות בדואר רשום**
4. **לשמור עותקים של הכל**

💡 האם תרצי שאכין טיוטת מכתב התנגדות?""",
            "task_type": "debt_dispute",
            "urgency": "high",
            "suggested_actions": ["draft_dispute_letter", "gather_documents"]
        }
    
    elif any(word in message_lower for word in ["דחוף", "היום", "מה קורה"]):
        return {
            "response": """📋 **המשימות הדחופות היום:**

🔥 **דחוף מאוד:**
• כרמית לוי - סמינר פסיכולוגיה (דדליין היום!)
• PAIR Finance - מכתב התנגדות (נשארו 2 ימים)

⏰ **השבוע:**
• TK ביטוח בריאות - הגשת מסמכים (6 ימים)
• רישום נישואין - בירור סטטוס

**המלצה:** התחילי עם כרמית - זה הדדליין הקרוב ביותר!""",
            "task_type": "urgent_overview", 
            "urgency": "high",
            "suggested_actions": ["focus_on_carmit", "prepare_pair_response"]
        }
    
    elif any(word in message_lower for word in ["בירוקרטיה", "רשות", "ביטוח"]):
        return {
            "response": """🏛️ **סטטוס בירוקרטיה:**

🚨 **דחוף:**
• TK ביטוח בריאות - חסרים מסמכים (דדליין: 6 ימים)

⏳ **בתהליך:**
• רישום נישואין (Standesamt) - ממתינים לתשובה
• אישור שהייה (LEA) - טופס בבדיקה

✅ **מושלם:**
• Jobcenter/Bürgergeld - מאושר

**הפעולה הבאה:** שליחת מסמכים ל-TK בדואר רשום""",
            "task_type": "bureaucracy_status",
            "urgency": "medium", 
            "suggested_actions": ["prepare_tk_documents", "check_standesamt_status"]
        }
    
    else:
        return {
            "response": f"""👋 **שלום מיכל!**

קיבלתי את הודעתך: "{message}"

🤖 אני העוזר החכם שלך ויכול לעזור עם:
📚 **משימות אקדמיות** - לקוחות, תזות וסמינרים
💰 **חובות והתנגדויות** - PAIR Finance ואחרים  
🏛️ **בירוקרטיה** - רשויות, ביטוח, רישומים
💬 **שאלות כלליות** - כל מה שבא לך

איך בדיוק אני יכול לסייע היום? 🎯""",
            "task_type": "general",
            "urgency": "low",
            "suggested_actions": ["ask_specific_question"]
        }

# נקודות קצה של API
@app.get("/")
async def root():
    """בדיקת בסיס"""
    return {"message": "🤖 מיכל AI Agent פועל!", "status": "active"}

@app.get("/health")
async def health_check():
    """בדיקת תקינות המערכת"""
    return {
        "status": "healthy",
        "ai_agent": "connected" if smart_agent else "fallback_mode",
        "timestamp": datetime.now().isoformat(),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "development_mode": not smart_agent or getattr(smart_agent, 'development_mode', True)
    }

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """נקודת קצה ראשית לצ'אט עם הסוכן"""
    try:
        if smart_agent:
            # השתמשי בסוכן החכם אמיתי
            print(f"📨 הודעה: {request.message}")
            response = await smart_agent.process_message(request.message, request.context)
            print(f"🤖 תגובה: {response.get('response', 'ללא תגובה')}")
            return response
        else:
            # מצב fallback
            print(f"⚠️ מצב fallback - הודעה: {request.message}")
            response = get_fallback_response(request.message, request.context)
            response["source"] = "fallback"
            return response
            
    except Exception as e:
        print(f"❌ שגיאה בצ'אט: {e}")
        return {
            "response": f"מצטערת, יש לי בעיה טכנית: {str(e)}",
            "task_type": "error",
            "urgency": "low",
            "error": True,
            "source": "error_handler"
        }

@app.get("/debug")
async def debug_info():
    """מידע לדיבאג"""
    return {
        "agent_loaded": smart_agent is not None,
        "agent_class": str(type(smart_agent)) if smart_agent else None,
        "development_mode": getattr(smart_agent, 'development_mode', None) if smart_agent else None,
        "openai_key_set": bool(os.getenv("OPENAI_API_KEY")),
        "python_path": os.getcwd(),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    host = os.getenv("SMART_SERVER_HOST", "0.0.0.0")
    port = int(os.getenv("SMART_SERVER_PORT", "8000"))

    print("🤖 מפעיל את הסוכן החכם של מיכל...")
    print(f"📡 API יהיה זמין בכתובת: http://{host}:{port}")
    print(f"📚 תיעוד API: http://{host}:{port}/docs")

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )