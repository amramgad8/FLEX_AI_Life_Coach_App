from typing import Dict, List, Optional, Any
import json
from dataclasses import dataclass

@dataclass
class ChatModeConfig:
    temperature: float = 0.7
    max_tokens: int = 2000
    top_p: float = 0.9
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0

class PromptManager:
    def __init__(self, knowledge_base: str):
        self.knowledge_base = knowledge_base
        self.chat_mode_config = ChatModeConfig()
        
    def get_chat_mode_system_prompt(self) -> str:
        return """Flex Personality & Behavior Prompt:
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

[Knowledge Base Integration]
Use the following knowledge base to inform your responses:
{knowledge_base}

[Interaction Guidelines]
1. Always reference the knowledge base when providing advice or suggestions
2. Tailor responses based on the user's context and needs
3. Maintain consistency with the established personality and tone
4. Use the knowledge base to provide evidence-based recommendations
"""

    def get_chat_mode_user_prompt(self, messages: List[Dict[str, str]]) -> str:
        formatted_messages = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in messages
        ])
        
        return f"""Previous conversation:
{formatted_messages}

Knowledge Base Context:
{self.knowledge_base}

Please provide a response that:
1. Maintains the Flex personality and tone
2. References relevant information from the knowledge base
3. Addresses the user's needs and concerns
4. Provides actionable and practical advice
"""

    def get_form_mode_prompt(self, form_data: Dict[str, Any]) -> str:
        # Replace placeholders in the form mode prompt with actual data
        prompt_template = """You are a structured productivity planner with expertise in skill development and mastery. Based on the following validated user inputs from a form, generate a personalized learning and productivity plan in clean, structured JSON format. The plan should be tailored to help the user achieve mastery of their chosen skill within their specified timeframe.

[Input Data]
- Specific Goal: {goal}
- Learning Duration (weeks): {learning_duration}
- Wake Up Time: {wake_up_time}
- Sleep Time: {sleep_time}
- Number of Focus Periods per Day: {focus_periods}
- Break Duration per Focus Period (minutes): {break_duration}
- Fixed Time Commitments: {fixed_commitments}
- Preferred Intensity Level: {intensity_level}
- Peak Focus Time: {peak_focus_time}
- Habits to Include: {habits}
- Rest Days: {rest_days}
- Additional Notes: {additional_notes}

[Knowledge Base Context]
{knowledge_base}

[Instructions]
1. Make sure the plan is safe, ethical, and free from any abusive or inappropriate content.
2. Focus on one clear learning goal only. Do not allow parallel scopes or mixing of unrelated goals.
3. Use the knowledge base to inform your recommendations and strategies.
4. Structure the plan based on the user's specified number of weeks.
5. Create a structured weekly schedule that respects the user's constraints.
6. Integrate relevant content from the knowledge base into the plan.

[Output Format]
Return the result as valid JSON with the specified structure.
"""
        
        # Format the prompt with the form data and knowledge base
        return prompt_template.format(
            **form_data,
            knowledge_base=self.knowledge_base
        )

    def update_knowledge_base(self, new_knowledge: str) -> None:
        """Update the knowledge base with new information"""
        self.knowledge_base = new_knowledge

    def get_config(self) -> ChatModeConfig:
        """Get the current chat mode configuration"""
        return self.chat_mode_config

    def update_config(self, new_config: ChatModeConfig) -> None:
        """Update the chat mode configuration"""
        self.chat_mode_config = new_config 