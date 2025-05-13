from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from ..models.config import Config

class LLMService:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=config.google_api_key,
            temperature=0.7
        )
        self.memory = ConversationBufferMemory()
        
        # Initialize chat prompt template
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful productivity assistant. Use the following context to answer the user's question:"),
            ("human", "{context}\n\nQuestion: {question}")
        ])
        
        # Initialize LLM chain
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.chat_prompt,
            memory=self.memory,
            verbose=config.debug_mode
        )
    
    def generate_response(self, question: str, context: Optional[List[str]] = None) -> str:
        """Generate a response using the LLM."""
        try:
            # Prepare context
            context_text = "\n".join(context) if context else ""
            
            # Generate response
            response = self.chain.run(
                context=context_text,
                question=question
            )
            
            return response
            
        except Exception as e:
            if self.config.debug_mode:
                print(f"Error generating response: {str(e)}")
            return f"Error: {str(e)}"
    
    def reset_memory(self):
        """Reset the conversation memory."""
        self.memory = ConversationBufferMemory()
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.chat_prompt,
            memory=self.memory,
            verbose=self.config.debug_mode
        ) 