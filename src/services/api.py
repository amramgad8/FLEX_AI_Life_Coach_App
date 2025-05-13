from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
import os
from dotenv import load_dotenv
from .rag_system import RAGSystem
from .config import Config
import json
import logging

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Flex AI API", description="API for Flex AI productivity assistant")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
config = Config()
rag_system = RAGSystem(config)

# Pydantic models for request/response
class UserProfile(BaseModel):
    goal: str
    wake_time: str
    sleep_time: str
    focus_periods: int
    break_duration: int
    work_style: Union[str, None] = None
    habits: Union[str, None] = None
    rest_days: Union[str, None] = None

class ChatMessage(BaseModel):
    message: str
    user_profile: Union[UserProfile, None] = None

class RoadmapRequest(BaseModel):
    goal: str

class FormSubmission(BaseModel):
    form_data: dict
    user_profile: Union[UserProfile, None] = None

class ChatInteraction(BaseModel):
    message: str
    context: dict = {}
    history: list = []

def map_preferences_to_profile(prefs: dict) -> UserProfile:
    """Map frontend UserPreferences (camelCase) to backend UserProfile (snake_case)"""
    return UserProfile(
        goal=prefs.get('primaryGoal') or prefs.get('goal', ''),
        wake_time=prefs.get('wakeUpTime') or prefs.get('wake_time', ''),
        sleep_time=prefs.get('sleepTime') or prefs.get('sleep_time', ''),
        focus_periods=prefs.get('focusPeriods') or prefs.get('focus_periods', 0),
        break_duration=prefs.get('breakDuration') or prefs.get('break_duration', 0),
        work_style=prefs.get('workStyle') or prefs.get('work_style'),
        habits=prefs.get('habits'),
        rest_days=prefs.get('restDays') or prefs.get('rest_days'),
    )

def normalize_plan_tasks(plan):
    for milestone in plan.get('milestones', []):
        milestone['tasks'] = [
            {"title": t} if isinstance(t, str) else t
            for t in milestone.get('tasks', [])
        ]
    return plan

# API endpoints
@app.post("/api/chat")
async def chat(message: ChatMessage):
    """Chat endpoint for interactive conversation"""
    try:
        response = rag_system.query(message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-plan")
async def generate_plan(profile: UserProfile):
    """Generate a personalized productivity plan"""
    try:
        # Get relevant context from RAG
        rag_context = rag_system.vector_db.search(profile.goal, n_results=5)['documents']
        context_text = "\n".join(rag_context)

        plan_prompt = (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": string, "goal": string, "milestones": [{{"title": string, "tasks": [string, ...]}}]}}\n'
            f"- header_note: A motivating summary, overall strategy, tips, tricks, user state, mindset advice, and any high-level information from the RAG documents.\n"
            f"- goal: The main goal.\n"
            f"- milestones: An array of milestones, each with a title and a list of actionable tasks.\n"
            f"- The plan should be for the specific goal only (not a full daily schedule).\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- Make the plan motivating and easy to follow.\n"
            f"- Use the RAG context to provide personalized tips, mindset shifts, and strategies in the header_note.\n"
            f"- Goal: {profile.goal}\n"
            f"- Wake Up Time: {profile.wake_time}\n"
            f"- Sleep Time: {profile.sleep_time}\n"
            f"- Focus Periods Per Day: {profile.focus_periods}\n"
            f"- Break Duration: {profile.break_duration} minutes\n"
            f"- Work Style: {profile.work_style}\n"
            f"- Habits: {profile.habits}\n"
            f"- Rest Days: {profile.rest_days}\n\n"
            f"Instructions:\n"
            f"- Break the main goal into milestones and actionable tasks.\n"
            f"- Distribute tasks over the available focus periods.\n"
            f"- Suggest a daily schedule.\n"
        )

        response = rag_system.llm.generate_response(plan_prompt)
        cleaned = response.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned.replace('```json', '').replace('```', '').strip()
        elif cleaned.startswith('```'):
            cleaned = cleaned.replace('```', '').replace('```', '').strip()
        plan_data = json.loads(cleaned)
        plan_data = normalize_plan_tasks(plan_data)
        return {"plan": plan_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    """Generate a detailed roadmap for a specific goal"""
    try:
        # Get relevant context from RAG
        rag_context = rag_system.vector_db.search(request.goal, n_results=5)['documents']
        context_text = "\n".join(rag_context)

        roadmap_prompt = (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable roadmap for the following goal:\n"
            f"Goal: {request.goal}\n\n"
            f"Instructions:\n"
            f"- Break the goal into 3-6 major milestones.\n"
            f"- For each milestone, list 3-5 actionable tasks.\n"
            f"- If relevant, show dependencies.\n"
            f"- Suggest a logical order or timeline for milestones.\n"
            f"- Present the roadmap in a clear, structured format.\n"
            f"- Make the roadmap motivating and easy to follow.\n"
        )

        roadmap = rag_system.llm.generate_response(roadmap_prompt)
        return {"roadmap": roadmap}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/form")
async def handle_form(form_data: FormSubmission):
    print("Received /api/form request")
    try:
        profile = map_preferences_to_profile(form_data.form_data)
        print("Mapped profile:", profile)
        rag_context = rag_system.vector_db.search(profile.goal, n_results=5)['documents']
        print("RAG context:", rag_context)
        context_text = "\n".join(rag_context)
        plan_prompt = (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": string, "goal": string, "milestones": [{{"title": string, "tasks": [string, ...]}}]}}\n'
            f"- header_note: A motivating summary, overall strategy, tips, tricks, user state, mindset advice, and any high-level information from the RAG documents.\n"
            f"- goal: The main goal.\n"
            f"- milestones: An array of milestones, each with a title and a list of actionable tasks.\n"
            f"- The plan should be for the specific goal only (not a full daily schedule).\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- Make the plan motivating and easy to follow.\n"
            f"- Use the RAG context to provide personalized tips, mindset shifts, and strategies in the header_note.\n"
            f"- Goal: {profile.goal}\n"
            f"- Wake Up Time: {profile.wake_time}\n"
            f"- Sleep Time: {profile.sleep_time}\n"
            f"- Focus Periods Per Day: {profile.focus_periods}\n"
            f"- Break Duration: {profile.break_duration} minutes\n"
            f"- Work Style: {profile.work_style}\n"
            f"- Habits: {profile.habits}\n"
            f"- Rest Days: {profile.rest_days}\n\n"
            f"Instructions:\n"
            f"- Break the main goal into milestones and actionable tasks.\n"
            f"- Distribute tasks over the available focus periods.\n"
            f"- Suggest a daily schedule.\n"
        )
        print("Plan prompt:", plan_prompt)
        response = rag_system.llm.generate_response(plan_prompt)
        cleaned = response.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned.replace('```json', '').replace('```', '').strip()
        elif cleaned.startswith('```'):
            cleaned = cleaned.replace('```', '').replace('```', '').strip()
        plan_data = json.loads(cleaned)
        plan_data = normalize_plan_tasks(plan_data)
        return {"plan": plan_data}
    except Exception as e:
        print("Error in /api/form:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/interactive")
async def interactive_chat(interaction: ChatInteraction):
    print("Received /api/chat/interactive request")
    try:
        chat_response = rag_system.process_chat_interaction(
            interaction.message,
            interaction.context,
            interaction.history
        )
        print("Chat response:", chat_response)
        return {"response": chat_response}
    except Exception as e:
        print("Error in /api/chat/interactive:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}