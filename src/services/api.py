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
    learning_duration: int

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
    """Map frontend form data to backend UserProfile"""
    try:
        # Extract and validate required fields
        goal = prefs.get('goal', '').strip()
        if not goal:
            raise ValueError("Goal is required")
            
        # Extract and validate time fields
        wake_time = prefs.get('wake_time', '09:00')
        sleep_time = prefs.get('sleep_time', '17:00')
        
        # Extract and validate numeric fields
        try:
            focus_periods = int(prefs.get('focus_periods', 4))
            if focus_periods < 1 or focus_periods > 8:
                raise ValueError("Focus periods must be between 1 and 8")
        except (ValueError, TypeError):
            focus_periods = 4
            
        try:
            break_duration = int(prefs.get('break_duration', 5))
            if break_duration < 1 or break_duration > 60:
                raise ValueError("Break duration must be between 1 and 60 minutes")
        except (ValueError, TypeError):
            break_duration = 5
            
        try:
            learning_duration = int(prefs.get('learning_duration', 4))
            if learning_duration < 1 or learning_duration > 52:
                raise ValueError("Learning duration must be between 1 and 52 weeks")
        except (ValueError, TypeError):
            learning_duration = 4
        
        # Create and return the profile
        return UserProfile(
            goal=goal,
            wake_time=wake_time,
            sleep_time=sleep_time,
            focus_periods=focus_periods,
            break_duration=break_duration,
            work_style=prefs.get('work_style', 'structured'),
            habits=prefs.get('habits', ''),
            rest_days=prefs.get('rest_days', ''),
            learning_duration=learning_duration
        )
    except Exception as e:
        print("Error mapping preferences to profile:", str(e))
        raise ValueError(f"Invalid form data: {str(e)}")

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

        # Get learning_duration if present (default to 4 if not)
        learning_duration = getattr(profile, 'learning_duration', 4)

        plan_prompt = (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": string, "goal": string, "weekly_phases": [{{"week": number, "milestone": string, "tasks": [string, ...]}}]}}\n'
            f"- header_note: A motivating summary, overall strategy, tips, tricks, user state, mindset advice, and any high-level information from the RAG documents.\n"
            f"- goal: The main goal.\n"
            f"- weekly_phases: An array of weeks, each with a week number, milestone, and a list of actionable tasks.\n"
            f"- The plan should be for the specific goal only (not a full daily schedule).\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- Make the plan motivating and easy to follow.\n"
            f"- Use the RAG context to provide personalized tips, mindset shifts, and strategies in the header_note.\n"
            f"- Goal: {profile.goal}\n"
            f"- Learning Duration (weeks): {learning_duration}\n"
            f"- Wake Up Time: {profile.wake_time}\n"
            f"- Sleep Time: {profile.sleep_time}\n"
            f"- Focus Periods Per Day: {profile.focus_periods}\n"
            f"- Break Duration: {profile.break_duration} minutes\n"
            f"- Work Style: {profile.work_style}\n"
            f"- Habits: {profile.habits}\n"
            f"- Rest Days: {profile.rest_days}\n\n"
            f"Instructions:\n"
            f"- **Strict Weekly Structure Requirement:**\n"
            f"  - Divide the plan into exactly {learning_duration} weeks.\n"
            f"  - Each week must have its own milestone, objectives, and tasks.\n"
            f"  - Do not combine multiple weeks into a single milestone or section.\n"
            f"  - The output must have one milestone and one section per week, matching the user's specified duration.\n"
            f"- Break the main goal into weekly milestones and actionable tasks.\n"
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
        # Extract form data from the request
        form_data_dict = form_data.form_data
        print("Form data received:", form_data_dict)
        
        # Map form data to profile
        profile = map_preferences_to_profile(form_data_dict)
        print("Mapped profile:", profile)
        
        # Get learning duration from form data
        learning_duration = form_data_dict.get('learning_duration', 4)
        
        # Search for relevant context
        try:
            rag_context = rag_system.vector_db.search(profile.goal, n_results=5)['documents']
            print("RAG context found:", len(rag_context), "documents")
        except Exception as e:
            print("Error searching vector DB:", str(e))
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve relevant context for your goal. Please try again."
            )
        
        context_text = "\n".join(rag_context)
        
        # Generate plan prompt
        plan_prompt = (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": string, "goal": string, "weekly_phases": [{{"week": number, "milestone": string, "tasks": [string, ...]}}]}}\n'
            f"- header_note: A motivating summary, overall strategy, tips, tricks, user state, mindset advice, and any high-level information from the RAG documents.\n"
            f"- goal: The main goal.\n"
            f"- weekly_phases: An array of weeks, each with a week number, milestone, and a list of actionable tasks.\n"
            f"- The plan should be for the specific goal only (not a full daily schedule).\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- Make the plan motivating and easy to follow.\n"
            f"- Use the RAG context to provide personalized tips, mindset shifts, and strategies in the header_note.\n"
            f"- Goal: {profile.goal}\n"
            f"- Learning Duration (weeks): {learning_duration}\n"
            f"- Wake Up Time: {profile.wake_time}\n"
            f"- Sleep Time: {profile.sleep_time}\n"
            f"- Focus Periods Per Day: {profile.focus_periods}\n"
            f"- Break Duration: {profile.break_duration} minutes\n"
            f"- Work Style: {profile.work_style}\n"
            f"- Habits: {profile.habits}\n"
            f"- Rest Days: {profile.rest_days}\n\n"
            f"Instructions:\n"
            f"- **Strict Weekly Structure Requirement:**\n"
            f"  - Divide the plan into exactly {learning_duration} weeks.\n"
            f"  - Each week must have its own milestone, objectives, and tasks.\n"
            f"  - Do not combine multiple weeks into a single milestone or section.\n"
            f"  - The output must have one milestone and one section per week, matching the user's specified duration.\n"
            f"- Break the main goal into weekly milestones and actionable tasks.\n"
            f"- Distribute tasks over the available focus periods.\n"
            f"- Suggest a daily schedule.\n"
        )
        
        # Generate response
        try:
            response = rag_system.llm.generate_response(plan_prompt)
            print("LLM response received:", response)
            
            # Get the response content from the dictionary
            response_content = response.get("response", "")
            if not response_content:
                raise ValueError("Empty response from LLM")
            
            # Clean and parse the response
            cleaned = response_content.strip()
            if cleaned.startswith('```json'):
                cleaned = cleaned.replace('```json', '').replace('```', '').strip()
            elif cleaned.startswith('```'):
                cleaned = cleaned.replace('```', '').replace('```', '').strip()
            
            # Parse JSON and validate structure
            try:
                plan_data = json.loads(cleaned)
                if not all(key in plan_data for key in ["header_note", "goal", "weekly_phases"]):
                    raise ValueError("Invalid plan structure: missing required fields")
                if not isinstance(plan_data["weekly_phases"], list):
                    raise ValueError("Invalid plan structure: weekly_phases must be a list")
                
                # Normalize tasks
                plan_data = normalize_plan_tasks(plan_data)
                return {"plan": plan_data}
                
            except json.JSONDecodeError as e:
                print("JSON decode error:", str(e))
                raise HTTPException(
                    status_code=500,
                    detail="Failed to parse the generated plan. Please try again."
                )
            except ValueError as e:
                print("Plan structure error:", str(e))
                raise HTTPException(
                    status_code=500,
                    detail=str(e)
                )
                
        except Exception as e:
            print("LLM error:", str(e))
            raise HTTPException(
                status_code=500,
                detail="Failed to generate plan. Please try again."
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print("Unexpected error in /api/form:", str(e))
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )

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