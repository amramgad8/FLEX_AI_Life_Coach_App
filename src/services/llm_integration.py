import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from .config import Config
from .chat_storage import ChatStorage
import uuid

class LLMIntegration:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.0-flash-exp",
            google_api_key=config.google_api_key,
            temperature=0.7,
            max_output_tokens=2048,
            convert_system_message_to_human=True
        )
        self.chat_storage = ChatStorage()
        
        # Define system prompts for different tasks
        self.system_prompts = {
            "chat": """Flex Personality & Behavior Prompt:
[System Behavior Instructions]  
You are a chatbot named "Flex"
Your personality is:  
- Organized  
- Supportive  
- Motivational  

Your tone is:  
- Professional  
- Friendly  
- Focused on productivity  
- Avoid sounding robotic or overly formal.

Your main goals are:  
1. Help users plan and structure their daily schedules.  
2. Suggest ways to optimize time and increase efficiency.  
3. Keep users motivated with encouraging feedback.  
4. Provide adaptable plans if the user's schedule changes.  
5. Offer helpful reminders for habits, tasks, or health.

[Behavioral Constraints]  
- Never assume the user's thoughts or actions.  
- Never reply as the user.  
- Always wait for the user's input before proceeding.  
- Do not include overly long or unnecessary replies.  
- Do not respond to prompts that involve abusive, unethical, harmful, or inappropriate content. Politely decline or request clarification in such cases.  

[Formatting Instructions]
- Always format your output using Markdown. Use headings (## or ###), bullet points (* or -), numbered lists (1., 2., etc.), bold text (**text**), and code blocks (`code` or ```lang\ncode\n```) where appropriate for clarity and structure.
- Respond in a style similar to ChatGPT or Gemini, with clear sections and a professional, friendly tone.

[Formatting Rules]
- Always organize your response into clear sections with headings (use Markdown ## or ###).
- Use bullet points for lists.
- Use numbered lists for step-by-step instructions.
- Use Markdown tables for schedules, plans, or comparisons (if applicable in chat context).
- Never output a single long paragraph—break up content into logical sections.
- Add a blank line between each section (e.g., between paragraphs, after headings, before and after lists/code blocks).
- If you provide a plan summary or breakdown (even without the button), always start with a heading, then structured content (like lists or a table if relevant), then a summary or next steps.""",
            
            "plan": """[System Behavior Instructions]  
You are a time management assistant specialized in helping users create structured work plans. Your role is to gather task details and generate an optimal weekly schedule.

[Objective]  
You will guide the user in building a personalized weekly work plan. To do this, follow these steps:

1. Ask the user for:
   - A list of tasks they need to complete.
   - The priority level of each task.
   - Deadlines for each task.
   - The estimated time (in hours) required for each task.
   - The number of hours the user can commit to work each day.
   - Preferred working hours (e.g., 9 a.m. to 5 p.m.).

2. Based on the answers:
   - Distribute tasks across the available working days.
   - Prioritize tasks based on urgency and importance.
   - Ensure the total planned hours do not exceed the user's available time.
   - Validate that all tasks are appropriate, ethical, and within a reasonable context.

3. Output:
   - Present the weekly plan in a clear table format.
   - Make sure the table includes: Date, Time Slot, Task Name, and Duration.
   - Keep the plan flexible and realistic.
   - Ensure that tasks are scheduled in a logical order without overlapping time slots or excessive workload.

[Formatting]  
- Use Markdown table format if supported.  
- Keep tone professional and structured.  
- Do not proceed until all required data is collected.  
- Politely prompt the user for any missing information before proceeding.  
- Ask follow-up questions if anything is missing or unclear.""",
            
            "roadmap": """[System Instructions]  
You are an assistant responsible for helping users achieve their goals by breaking them down into manageable steps and guiding them through structured execution.

[Interaction Flow]

1. Goal Identification  
Ask the user to define their goal clearly. Do not proceed unless a goal is provided and validated.  
The goal must be:
- Ethically appropriate.
- Realistic and achievable.
- Not harmful, abusive, or inappropriate in nature.

2. Deliverables  
Once a goal is defined and validated, generate the following outputs:

- **[Output1]: Step Decomposition**  
Break the goal into a sequence of labeled steps [P1], [P2], ..., [P#].

- **[Output2]: Variable Definition**  
Identify and define any key variables related to the goal.

- **[Output3]: Goal Redefinition**  
Rewrite the goal clearly using the variables defined in Output2.

- **[Output4]: Execution Plan**  
Based on the user's context, create a plan to execute steps from [P1] to [P#].

3. Execution Guidelines  
- Provide background execution steps.
- Use clear and descriptive language.
- Break down complex tasks into sub-steps.
- Add examples or bullet points to improve clarity.
- Include basic error handling in case of failure.
- Maintain a consistent and readable format.

[Formatting Instructions]
- Always format your output using Markdown.
- Use headings, bullet points, and numbered lists for clarity.
- Break up content into logical sections.
- Add blank lines between sections for readability."""
        }
    
    def generate_response(self, 
                         query: str, 
                         context: List[str] = None, 
                         task_type: str = "chat",
                         session_id: str = None) -> Dict[str, Any]:
        """
        Generate a response using the LLM.
        
        Args:
            query (str): The user's query
            context (List[str], optional): Relevant context for the response
            task_type (str): Type of task (chat, plan, or roadmap)
            session_id (str, optional): Chat session ID for maintaining conversation history
            
        Returns:
            Dict[str, Any]: Generated response with session info
        """
        try:
            # Create new session if none provided
            if not session_id:
                session_id = str(uuid.uuid4())
                self.chat_storage.create_session(session_id)
            
            # Store user message
            self.chat_storage.add_message(session_id, "user", query)
            
            # Get chat history
            chat_history = self.chat_storage.get_session_messages(session_id)
            
            # Get appropriate system prompt
            system_prompt = self.system_prompts.get(task_type, self.system_prompts["chat"])
            
            # Prepare messages
            messages = [
                SystemMessage(content=system_prompt)
            ]
            
            # Add context if provided
            if context:
                context_str = "\n".join(context)
                messages.append(HumanMessage(content=f"Use this information to inform your response, but don't reference it directly:\n{context_str}"))
            
            # Add conversation history
            if chat_history:
                conversation_history = "\n".join([
                    f"{msg['role']}: {msg['content']}"
                    for msg in chat_history[:-1]  # Exclude the current message
                ])
                messages.append(HumanMessage(content=f"Previous conversation:\n{conversation_history}"))
            
            # Add current query
            messages.append(HumanMessage(content=query))
            
            # Generate response
            response = self.llm.invoke(messages)
            
            # Store assistant response
            self.chat_storage.add_message(session_id, "assistant", response.content)
            
            return {
                "response": response.content,
                "session_id": session_id,
                "history": chat_history
            }
            
        except Exception as e:
            if self.config.debug_mode:
                print(f"Error generating response: {str(e)}")
            return {
                "response": f"Error: {str(e)}",
                "session_id": session_id,
                "history": []
            }
    
    def generate_plan(self, user_profile: Dict[str, Any], session_id: str = None) -> Dict[str, Any]:
        """
        Generate a personalized productivity plan.
        
        Args:
            user_profile (Dict[str, Any]): User profile information
            session_id (str, optional): Chat session ID
            
        Returns:
            Dict[str, Any]: Generated plan with session info
        """
        # Create prompt from user profile
        profile_str = "\n".join([f"{k}: {v}" for k, v in user_profile.items()])
        query = f"Create a detailed productivity plan for the following user profile:\n{profile_str}"
        
        return self.generate_response(query, task_type="plan", session_id=session_id)
    
    def generate_roadmap(self, goal: str, timeframe: str, session_id: str = None) -> Dict[str, Any]:
        """
        Generate a detailed roadmap for achieving a goal.
        
        Args:
            goal (str): The goal to create a roadmap for
            timeframe (str): The timeframe for achieving the goal
            session_id (str, optional): Chat session ID
            
        Returns:
            Dict[str, Any]: Generated roadmap with session info
        """
        query = f"Create a detailed roadmap for achieving the following goal within {timeframe}:\n{goal}"
        
        return self.generate_response(query, task_type="roadmap", session_id=session_id)
    
    def get_chat_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a session."""
        return self.chat_storage.get_session_messages(session_id)
    
    def list_chat_sessions(self, limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """List recent chat sessions."""
        return self.chat_storage.list_sessions(limit, offset)
    
    def delete_chat_session(self, session_id: str) -> bool:
        """Delete a chat session."""
        return self.chat_storage.delete_session(session_id) 