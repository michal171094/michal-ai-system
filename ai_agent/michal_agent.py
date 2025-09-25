"""
מערכת עוזר AI חכם למיכל - LangGraph Agent
מנהל זרם עבודה מורכב למשימות אקדמיות, חובות ובירוקרטיה
"""

from typing import Dict, Any, List, Optional, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

class WorkflowState(TypedDict):
    """מצב זרם העבודה - מה הסוכן יודע ועל מה הוא עובד"""
    
    # קלט מהמשתמש
    user_input: str
    user_context: Dict[str, Any]
    
    # ניתוח הקלט
    task_type: str  # academic, debt, bureaucracy, general
    urgency_level: str  # critical, high, medium, low
    entities: Dict[str, Any]  # לקוחות, סכומים, תאריכים שזוהו
    
    # מידע מהמערכת  
    related_tasks: List[Dict[str, Any]]
    client_history: List[Dict[str, Any]]
    relevant_knowledge: List[str]
    
    # תגובה מוצעת
    suggested_action: str
    draft_response: str
    confidence_score: float
    
    # סטטוס
    current_step: str
    requires_approval: bool
    final_response: str

class MichalAIAgent:
    """הסוכן החכם הראשי של מיכל"""
    
    def __init__(self, openai_api_key: str = None):
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        
        # בדיקת מצב פיתוח
        if not self.openai_api_key or self.openai_api_key == "sk-test-key-for-development":
            print("⚠️  מצב פיתוח: עובד ללא OpenAI API")
            self.llm = None
            self.development_mode = True
        else:
            try:
                self.llm = ChatOpenAI(
                    model="gpt-4o-mini",  # זול יותר לפיתוח
                    api_key=self.openai_api_key,
                    temperature=0.1
                )
                self.development_mode = False
                print("✅ מחובר ל-OpenAI API")
            except Exception as e:
                print(f"⚠️  שגיאה בחיבור ל-OpenAI: {e}")
                self.llm = None
                self.development_mode = True
        
        # נתונים סטטיים - בעתיד יבואו ממסד נתונים
        self.load_mock_data()
        
        # בניית הגרף
        self.workflow = self.create_workflow()
    
    def load_mock_data(self):
        """טעינת נתונים ראשוניים"""
        self.clients = {
            "מרב שטרן": {
                "type": "סטודנט מ.א", 
                "personality": "מפחדת מדדליינים",
                "preferred_tone": "רגוע ותומך"
            },
            "כרמית לוי": {
                "type": "סטודנט ב.א",
                "personality": "חצופה קצת", 
                "preferred_tone": "ישיר אבל מנומס"
            }
        }
        
        self.knowledge_base = [
            "בתיקי PAIR Finance - תמיד לדרוש הוכחות מפורטות",
            "עם TK ביטוח בריאות - לשלוח מסמכים בדואר רשום",
            "לקוחות עם חרדת דדליין - לשלוח תזכורת עדינה 3 ימים לפני",
        ]
    
    def create_workflow(self) -> StateGraph:
        """בניית זרם העבודה החכם"""
        
        workflow = StateGraph(WorkflowState)
        
        # הוספת שלבים
        workflow.add_node("intake", self.process_intake)
        workflow.add_node("analyze", self.analyze_content)
        workflow.add_node("research", self.research_context) 
        workflow.add_node("draft", self.create_draft)
        workflow.add_node("review", self.review_and_approve)
        workflow.add_node("execute", self.execute_action)
        
        # הגדרת הזרם
        workflow.set_entry_point("intake")
        workflow.add_edge("intake", "analyze")
        workflow.add_edge("analyze", "research")
        workflow.add_edge("research", "draft")
        workflow.add_edge("draft", "review")
        
        # תנאי - האם צריך אישור?
        workflow.add_conditional_edges(
            "review",
            self.should_get_approval,
            {
                "approve": END,  # מחזיר למיכל לאישור
                "execute": "execute"  # ביצוע אוטומטי
            }
        )
        
        workflow.add_edge("execute", END)
        
        return workflow.compile()
    
    def process_intake(self, state: WorkflowState) -> WorkflowState:
        """שלב 1: עיבוד ראשוני של הקלט"""
        
        user_input = state["user_input"]
        state["current_step"] = "intake"
        
        # זיהוי בסיסי של סוג הפנייה
        if any(word in user_input.lower() for word in ["חוב", "התנגדות", "pair", "גביה"]):
            state["task_type"] = "debt"
        elif any(word in user_input.lower() for word in ["תזה", "מאמר", "סמינר", "פרויקט"]):
            state["task_type"] = "academic" 
        elif any(word in user_input.lower() for word in ["רשות", "משרד", "טופס", "ביטוח"]):
            state["task_type"] = "bureaucracy"
        else:
            state["task_type"] = "general"
            
        # זיהוי דחיפות
        if any(word in user_input.lower() for word in ["דחוף", "היום", "מיד", "נגמר הזמן"]):
            state["urgency_level"] = "critical"
        elif any(word in user_input.lower() for word in ["השבוע", "בקרוב", "חשוב"]):
            state["urgency_level"] = "high"
        else:
            state["urgency_level"] = "medium"
            
        return state
    
    def analyze_content(self, state: WorkflowState) -> WorkflowState:
        """שלב 2: ניתוח מעמיק של התוכן עם AI"""
        
        state["current_step"] = "analyze"
        
        system_prompt = """את סוכן חכם למיכל המנהלת עסק אקדמי ומטפלת בחובות ובירוקרטיה.
        
נתח את הפנייה הבאה וחלץ:
1. שמות אנשים או חברות
2. סכומים ומטבעות  
3. תאריכים ומועדים
4. פעולות נדרשות
5. רמת רגש/לחץ בפנייה

תשובה בפורמט JSON עברי:"""

        try:
            if self.development_mode or not self.llm:
                # מצב פיתוח - תגובה סטנדרטית
                entities = {
                    "task_type": "general",
                    "urgency": "medium",
                    "names": [],
                    "amounts": [],
                    "dates": [],
                    "keywords": state["user_input"].split()[:3]
                }
                
                # זיהוי בסיסי של מילות מפתח
                if any(word in state["user_input"].lower() for word in ["pair", "התנגדות", "חוב"]):
                    entities["task_type"] = "debt"
                    entities["urgency"] = "high"
                elif any(word in state["user_input"].lower() for word in ["סמינר", "תזה", "לקוח"]):
                    entities["task_type"] = "academic"
                elif any(word in state["user_input"].lower() for word in ["ביטוח", "רישום", "רשות"]):
                    entities["task_type"] = "bureaucracy"
                    
            else:
                # מצב מלא עם OpenAI
                response = self.llm.invoke([
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=state["user_input"])
                ])
                
                # ניסיון לפרסר JSON, אם לא עובד - נתונים בסיסיים
                try:
                    entities = json.loads(response.content)
                except:
                    entities = {"error": "לא הצלחתי לנתח", "raw": response.content}
                    
            state["entities"] = entities
            
        except Exception as e:
            state["entities"] = {"error": str(e)}
            
        return state
    
    def research_context(self, state: WorkflowState) -> WorkflowState:
        """שלב 3: חיפוש מידע רלוונטי מהבסיס ידע"""
        
        state["current_step"] = "research"
        
        # חיפוש לקוחות רלוונטיים
        related_clients = []
        if "entities" in state and "names" in state.get("entities", {}):
            for name in state["entities"]["names"]:
                if name in self.clients:
                    related_clients.append({
                        "name": name,
                        "info": self.clients[name]
                    })
        
        state["client_history"] = related_clients
        
        # חיפוש ידע רלוונטי
        task_type = state.get("task_type", "")
        relevant_knowledge = [
            knowledge for knowledge in self.knowledge_base
            if any(keyword in knowledge.lower() 
                  for keyword in [task_type, state["user_input"][:20].lower()])
        ]
        
        state["relevant_knowledge"] = relevant_knowledge
        
        return state
    
    def create_draft(self, state: WorkflowState) -> WorkflowState:
        """שלב 4: יצירת טיוטת תגובה"""
        
        state["current_step"] = "draft"
        
        context = f"""
סוג המשימה: {state.get('task_type', 'לא ידוע')}
דחיפות: {state.get('urgency_level', 'רגילה')}
ישויות שזוהו: {state.get('entities', {})}
לקוחות רלוונטיים: {state.get('client_history', [])}
ידע רלוונטי: {state.get('relevant_knowledge', [])}
"""

        system_prompt = f"""את העוזרת החכמה של מיכל. 
        
על בסיס הפנייה והקשר הבא, צרי תגובה מועילה ומותאמת אישית.
אם זו פעולה שדורשת אישור (שליחת מייל, תשלום, מסמך רשמי) - ציני זאת.

הקשר:
{context}

תני תגובה ישירה ומועילה בעברית:"""

        try:
            if self.development_mode or not self.llm:
                # מצב פיתוח - תגובות מוכנות מראש
                task_type = state.get('entities', {}).get('task_type', 'general')
                user_input = state["user_input"].lower()
                
                if task_type == "debt" or any(word in user_input for word in ["pair", "חוב", "התנגדות"]):
                    state["draft_response"] = """לגבי PAIR Finance:
1. 🚫 לא להודות בחוב
2. 📋 לדרוש הוכחות מפורטות על החוב
3. ✉️ לשלוח התנגדות בדואר רשום
4. 📁 לשמור כל מסמך

האם תרצי שאכין לך טיוטת מכתב התנגדות?"""

                elif task_type == "academic" or any(word in user_input for word in ["סמינר", "תזה", "לקוח"]):
                    state["draft_response"] = """לגבי המשימה האקדמית:
📚 אני רואה שיש משימות אקדמיות פתוחות
⏰ הכי דחוף: כרמית - סמינר פסיכולוגיה (דדליין היום!)

האם תרצי שאעזור עם ארגון או כתיבה?"""

                elif task_type == "bureaucracy" or any(word in user_input for word in ["ביטוח", "רישום", "רשות"]):
                    state["draft_response"] = """לגבי הבירוקרטיה:
🏛️ TK ביטוח בריאות - דחוף! צריך להגיש מסמכים
📋 רישום נישואין - לברר סטטוס
✅ Jobcenter - מאושר

איך אני יכולה לעזור עם התהליך?"""

                else:
                    state["draft_response"] = f"""שלום מיכל! 👋
קיבלתי את השאלה שלך: "{state['user_input']}"

אני כאן לעזור עם:
📚 משימות אקדמיות ולקוחות
💰 חובות והתנגדויות  
🏛️ בירוקרטיה ומסמכים
💬 כל שאלה אחרת

איך בדיוק אני יכולה לסייע?"""
                
                state["confidence_score"] = 0.7
                
            else:
                # מצב מלא עם OpenAI
                response = self.llm.invoke([
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=state["user_input"])
                ])
                
                state["draft_response"] = response.content
                state["confidence_score"] = 0.8  # בעתיד נחשב על בסיס איכות הנתונים
            
        except Exception as e:
            state["draft_response"] = f"מצטערת, יש לי בעיה טכנית: {str(e)}"
            state["confidence_score"] = 0.1
            
        return state
    
    def review_and_approve(self, state: WorkflowState) -> WorkflowState:
        """שלב 5: בדיקה אם צריך אישור מיכל"""
        
        state["current_step"] = "review"
        
        # פעולות שדורשות אישור
        needs_approval_keywords = [
            "שלח מייל", "שלח הודעה", "תשלום", "חתמי", 
            "הגש בקשה", "צור מסמך", "התקשר"
        ]
        
        draft = state.get("draft_response", "").lower()
        state["requires_approval"] = any(
            keyword in draft for keyword in needs_approval_keywords
        )
        
        # הוספת הסברים
        if state["requires_approval"]:
            state["suggested_action"] = "מחכה לאישור מיכל לפני ביצוע"
        else:
            state["suggested_action"] = "מידע בלבד - לא נדרשת פעולה"
            
        return state
    
    def should_get_approval(self, state: WorkflowState) -> str:
        """החלטה אם לבקש אישור או לבצע"""
        return "approve" if state.get("requires_approval", False) else "execute"
    
    def execute_action(self, state: WorkflowState) -> WorkflowState:
        """שלב 6: ביצוע הפעולה (אם לא נדרש אישור)"""
        
        state["current_step"] = "execute"
        state["final_response"] = state["draft_response"]
        
        # כאן בעתיד נוסיף ביצוע אמיתי של פעולות
        # שליחת מיילים, עדכון מסד נתונים, וכו'
        
        return state
    
    async def process_message(self, user_input: str, user_context: Dict = None) -> Dict[str, Any]:
        """נקודת הכניסה הראשית - עיבוד הודעה ממיכל"""
        
        initial_state = WorkflowState(
            user_input=user_input,
            user_context=user_context or {},
            task_type="",
            urgency_level="",
            entities={},
            related_tasks=[],
            client_history=[],
            relevant_knowledge=[],
            suggested_action="",
            draft_response="",
            confidence_score=0.0,
            current_step="",
            requires_approval=False,
            final_response=""
        )
        
        try:
            # הרצת זרם העבודה
            result = await self.workflow.ainvoke(initial_state)
            
            return {
                "success": True,
                "response": result["final_response"] or result["draft_response"],
                "task_type": result["task_type"],
                "urgency": result["urgency_level"], 
                "requires_approval": result["requires_approval"],
                "suggested_action": result["suggested_action"],
                "confidence": result["confidence_score"],
                "entities": result.get("entities", {}),
                "debug_info": {
                    "steps_completed": result["current_step"],
                    "client_history": result["client_history"],
                    "relevant_knowledge": result["relevant_knowledge"]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": "מצטערת, יש לי בעיה טכנית. אנא נסי שוב."
            }

# יצירת instance גלובלי
michal_agent = None

def get_agent():
    """קבלת הסוכן (lazy loading)"""
    global michal_agent
    if michal_agent is None:
        michal_agent = MichalAIAgent()
    return michal_agent

if __name__ == "__main__":
    # בדיקה בסיסית
    import asyncio
    
    async def test():
        agent = MichalAIAgent()
        result = await agent.process_message("יש לי חוב מPAIR Finance, מה לעשות?")
        print(json.dumps(result, ensure_ascii=False, indent=2))
    
    asyncio.run(test())