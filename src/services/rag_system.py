from typing import List, Dict, Any
import os
import json
from dotenv import load_dotenv
from .vector_db import VectorDatabase
from .llm_integration import LLMIntegration
from .config import Config
import logging
from .document_processor import DocumentProcessor

class RAGSystem:
    def __init__(self, config: Config):
        self.config = config
        self.vector_db = VectorDatabase(config)
        self.llm = LLMIntegration(config)
        
        # Try to load existing vector database
        try:
            self.vector_db.load()
            print("Loaded existing vector database")
        except Exception as e:
            print(f"No existing vector database found or error loading: {e}")
            self._load_study_materials()
    
    def _load_study_materials(self):
        study_dir = os.path.join(os.getcwd(), 'Study_Materials')
        if not os.path.exists(study_dir):
            print(f"Study_Materials folder not found at {study_dir}")
            return
        # Only load if vector DB is empty
        if self.vector_db.documents:
            print("Vector DB already has documents, skipping Study_Materials loading.")
            return
        processor = DocumentProcessor(self.config)
        for fname in os.listdir(study_dir):
            if fname.lower().endswith('.pdf'):
                fpath = os.path.join(study_dir, fname)
                try:
                    print(f"Processing {fname}...")
                    chunks = processor.process_document(fpath)
                    metadata = [{"source": fname} for _ in chunks]
                    self.vector_db.add_documents(chunks, metadata)
                    print(f"Added {len(chunks)} chunks from {fname} to vector DB.")
                except Exception as e:
                    print(f"Error processing {fname}: {e}")
        
        # Save the vector database after loading documents
        try:
            self.vector_db.save()
            print("Saved vector database")
        except Exception as e:
            print(f"Error saving vector database: {e}")

    def _generate_plan_prompt(self, user_profile: dict, context_text: str) -> str:
        """Generate a prompt for plan creation"""
        return (
            f"Context from productivity literature:\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": "string", "goal": "string", "milestones": [{{"title": "string", "tasks": ["string", ...]}}]}}\n'
            f"- header_note: A motivating summary, overall strategy, tips, tricks, user state, mindset advice, and any high-level information from the RAG documents.\n"
            f"- goal: The main goal.\n"
            f"- milestones: An array of milestones, each with a title and a list of actionable tasks.\n"
            f"- The plan should be for the specific goal only (not a full daily schedule).\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- Make the plan motivating and easy to follow.\n"
            f"- Use the RAG context to provide personalized tips, mindset shifts, and strategies in the header_note.\n"
            f"- Goal: {user_profile['goal']}\n"
            f"- Wake Up Time: {user_profile['wake_time']}\n"
            f"- Sleep Time: {user_profile['sleep_time']}\n"
            f"- Focus Periods Per Day: {user_profile['focus_periods']}\n"
            f"- Break Duration: {user_profile['break_duration']} minutes\n"
            f"- Work Style: {user_profile['work_style']}\n"
            f"- Habits: {user_profile.get('habits', '')}\n"
            f"- Rest Days: {user_profile.get('rest_days', '')}\n\n"
            f"Instructions:\n"
            f"- Break the main goal into milestones and actionable tasks.\n"
            f"- Distribute tasks over the available focus periods.\n"
            f"- Suggest a daily schedule.\n"
        )

    def _generate_chat_plan_prompt(self, user_profile: dict, context_text: str) -> str:
        """Generate a prompt for chat-based plan creation (RAG only for header_note)"""
        return (
            f"Context from productivity literature (for STRATEGY & TIPS ONLY):\n{context_text}\n\n"
            f"Create a detailed, actionable plan for the following specific goal as a JSON object with the following structure:\n"
            f'{{"header_note": "string", "goal": "string", "milestones": [{{"title": "string", "tasks": ["string", ...]}}]}}\n'
            f"- header_note: Use ONLY the RAG context above to provide strategy, tips, and mindset advice.\n"
            f"- goal: The main goal (from the user).\n"
            f"- milestones: Break down the user's goal into actionable steps, based ONLY on the user's answers below.\n"
            f"- Do NOT use the RAG context for the milestones or tasks. Use only the user's answers.\n"
            f"- Present the plan ONLY as a valid JSON object, no markdown, no explanation, no extra text.\n"
            f"- User's answers: {json.dumps(user_profile, indent=2)}\n"
        )

    def process_form(self, form_data: dict) -> dict:
        """Process form data and generate appropriate response"""
        try:
            user_profile = {
                "goal": form_data.get("primaryGoal", "").strip(),
                "wake_time": form_data.get("startTime", "09:00"),
                "sleep_time": form_data.get("endTime", "17:00"),
                "focus_periods": int(form_data.get("focusPeriods", 4)),
                "break_duration": int(form_data.get("breakDuration", 5)),
                "work_style": "structured" if int(form_data.get("focusLength", 25)) >= 30 else "flexible",
                "habits": form_data.get("habits", ""),
                "rest_days": form_data.get("restDays", "")
            }
            if not user_profile["goal"]:
                return {"message": "Please provide your main goal.", "plan": "", "context": user_profile}
            try:
                rag_context = self.vector_db.search(user_profile["goal"], n_results=3)['documents']
            except Exception as e:
                logging.error(f"Vector DB error: {e}")
                return {"message": "Sorry, I couldn't find enough context for your goal. Please try a different goal.", "plan": "", "context": user_profile}
            context_text = "\n".join(rag_context)
            prompt = self._generate_plan_prompt(user_profile, context_text)
            try:
                response = self.llm.generate_response(prompt)
                # Ensure response is valid JSON
                plan_data = json.loads(response)
                if not all(key in plan_data for key in ["header_note", "goal", "milestones"]):
                    raise ValueError("Invalid plan structure")
                return {
                    "message": "I've analyzed your preferences and created a personalized plan. Here's what I recommend:",
                    "plan": response,
                    "context": user_profile
                }
            except json.JSONDecodeError:
                logging.error("Invalid JSON response from LLM")
                return {"message": "Sorry, I couldn't generate a valid plan. Please try again.", "plan": "", "context": user_profile}
            except Exception as e:
                logging.error(f"LLM error: {e}")
                return {"message": "Sorry, I couldn't generate a plan at this time. Please try again later.", "plan": "", "context": user_profile}
        except Exception as e:
            logging.error(f"process_form error: {e}")
            raise Exception(f"Error processing form: {str(e)}")

    def process_chat_interaction(self, message: str, context: dict, history: list = None) -> dict:
        """
        Process chat interaction with full conversational history.
        history: list of {"role": "user"/"assistant", "content": str}
        """
        try:
            if history is None:
                history = []
            msg = (message or "").strip()
            if not msg:
                return {"message": "Please enter a message to continue.", "context": context or {}, "history": history}
            # Add the user's message to the history
            history.append({"role": "user", "content": msg})
            # Build the prompt from the history
            prompt = ""
            for turn in history:
                if turn["role"] == "user":
                    prompt += f"User: {turn['content']}\n"
                else:
                    prompt += f"Assistant: {turn['content']}\n"
            prompt += "Assistant:"
            # Optionally, add RAG context at the top
            rag_context = self.vector_db.search(msg, n_results=3)['documents']
            context_text = "\n".join(rag_context)
            prompt = f"Context from productivity literature:\n{context_text}\n\n" + prompt
            # Get LLM response
            response = self.llm.generate_response(prompt)
            # Try to parse JSON from the response
            cleaned = response.strip()
            if cleaned.startswith('```json'):
                cleaned = cleaned.replace('```json', '').replace('```', '').strip()
            elif cleaned.startswith('```'):
                cleaned = cleaned.replace('```', '').replace('```', '').strip()
            try:
                plan_data = json.loads(cleaned)
                from .api import normalize_plan_tasks
                plan_data = normalize_plan_tasks(plan_data)
                assistant_message = "Here's your personalized plan:"
                history.append({"role": "assistant", "content": assistant_message})
                return {
                    "message": assistant_message,
                    "plan": plan_data,
                    "context": context,
                    "history": history
                }
            except Exception:
                # Not a plan, just a normal message
                history.append({"role": "assistant", "content": response})
                return {
                    "message": response,
                    "context": context,
                    "history": history
                }
        except Exception as e:
            logging.error(f"process_chat_interaction error: {e}")
            return {"message": "Sorry, something went wrong. Please try again.", "context": context or {}, "history": history}

    def query(self, message: str) -> str:
        """Handle general queries"""
        try:
            # Get relevant context from RAG
            rag_context = self.vector_db.search(message, n_results=3)['documents']
            context_text = "\n".join(rag_context)

            # Generate response
            prompt = (
                f"Context from productivity literature:\n{context_text}\n\n"
                f"User question: {message}\n\n"
                f"Provide a helpful and informative response based on the context above."
            )

            return self.llm.generate_response(prompt)
        except Exception as e:
            raise Exception(f"Error processing query: {str(e)}") 