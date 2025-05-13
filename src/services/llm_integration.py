import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from .config import Config

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
        
        # Define system prompts for different tasks
        self.system_prompts = {
            "chat": """You are a helpful AI assistant focused on productivity and personal development. 
            Use the provided context to give accurate and helpful responses. 
            If you're not sure about something, say so.""",
            
            "plan": """You are an expert productivity coach. Create a detailed, actionable plan based on the user's profile.
            Focus on practical steps and realistic goals.""",
            
            "roadmap": """You are an expert in creating detailed learning and development roadmaps.
            Break down complex goals into manageable steps and milestones."""
        }
    
    def generate_response(self, 
                         query: str, 
                         context: List[str] = None, 
                         task_type: str = "chat") -> str:
        """
        Generate a response using the LLM.
        
        Args:
            query (str): The user's query
            context (List[str], optional): Relevant context for the response
            task_type (str): Type of task (chat, plan, or roadmap)
            
        Returns:
            str: Generated response
        """
        # Get appropriate system prompt
        system_prompt = self.system_prompts.get(task_type, self.system_prompts["chat"])
        
        # Prepare messages
        messages = [
            SystemMessage(content=system_prompt)
        ]
        
        # Add context if provided
        if context:
            context_str = "\n".join(context)
            messages.append(HumanMessage(content=f"Context:\n{context_str}\n\nQuery: {query}"))
        else:
            messages.append(HumanMessage(content=query))
        
        # Generate response
        response = self.llm.invoke(messages)
        
        return response.content
    
    def generate_plan(self, user_profile: Dict[str, Any]) -> str:
        """
        Generate a personalized productivity plan.
        
        Args:
            user_profile (Dict[str, Any]): User profile information
            
        Returns:
            str: Generated plan
        """
        # Create prompt from user profile
        profile_str = "\n".join([f"{k}: {v}" for k, v in user_profile.items()])
        query = f"Create a detailed productivity plan for the following user profile:\n{profile_str}"
        
        return self.generate_response(query, task_type="plan")
    
    def generate_roadmap(self, goal: str, timeframe: str) -> str:
        """
        Generate a detailed roadmap for achieving a goal.
        
        Args:
            goal (str): The goal to create a roadmap for
            timeframe (str): The timeframe for achieving the goal
            
        Returns:
            str: Generated roadmap
        """
        query = f"Create a detailed roadmap for achieving the following goal within {timeframe}:\n{goal}"
        
        return self.generate_response(query, task_type="roadmap") 