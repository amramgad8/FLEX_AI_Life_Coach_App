from typing import List, Optional, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from ..models.config import Config
from .chat_storage import ChatStorage
import uuid

class LLMService:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=config.google_api_key,
            temperature=0.7
        )
        self.chat_storage = ChatStorage()
        
        # Initialize chat prompt template
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful productivity assistant. Use the following context to answer the user's question:"),
            ("human", "{context}\n\nQuestion: {question}")
        ])
        
        # Initialize LLM chain
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.chat_prompt,
            verbose=config.debug_mode
        )
    
    def generate_response(self, question: str, context: Optional[List[str]] = None, session_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate a response using the LLM."""
        try:
            # Create new session if none provided
            if not session_id:
                session_id = str(uuid.uuid4())
                self.chat_storage.create_session(session_id)
            
            # Store user message
            self.chat_storage.add_message(session_id, "user", question)
            
            # Get chat history
            chat_history = self.chat_storage.get_session_messages(session_id)
            
            # Prepare context
            context_text = "\n".join(context) if context else ""
            
            # Build conversation history
            conversation_history = "\n".join([
                f"{msg['role']}: {msg['content']}"
                for msg in chat_history[:-1]  # Exclude the current message
            ])
            
            # Generate response
            response = self.chain.run(
                context=f"{context_text}\n\nConversation History:\n{conversation_history}",
                question=question
            )
            
            # Store assistant response
            self.chat_storage.add_message(session_id, "assistant", response)
            
            return {
                "response": response,
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
    
    def get_chat_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a session."""
        return self.chat_storage.get_session_messages(session_id)
    
    def list_chat_sessions(self, limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
        """List recent chat sessions."""
        return self.chat_storage.list_sessions(limit, offset)
    
    def delete_chat_session(self, session_id: str) -> bool:
        """Delete a chat session."""
        return self.chat_storage.delete_session(session_id) 