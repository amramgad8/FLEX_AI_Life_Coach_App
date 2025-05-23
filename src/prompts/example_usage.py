from src.prompts.prompt_manager import PromptManager
from src.prompts.rag_integration import RAGIntegration

def main():
    # Initialize the knowledge base
    initial_knowledge = """
    Key productivity principles:
    1. Time blocking is an effective way to manage tasks
    2. Regular breaks improve focus and prevent burnout
    3. Setting clear goals helps maintain motivation
    4. Tracking progress is essential for long-term success
    """
    
    # Create prompt manager with initial knowledge
    prompt_manager = PromptManager(initial_knowledge)
    
    # Create RAG integration
    rag = RAGIntegration(prompt_manager)
    
    # Example chat interaction
    conversation_history = [
        {"role": "user", "content": "I need help organizing my study schedule"},
        {"role": "assistant", "content": "I'll help you create an effective study schedule. What subjects are you studying?"},
        {"role": "user", "content": "I'm studying Python programming and need to prepare for an exam in 2 weeks"}
    ]
    
    # Get enhanced prompt for chat
    chat_prompt = rag.process_chat_query(
        "I'm studying Python programming and need to prepare for an exam in 2 weeks",
        conversation_history
    )
    print("Chat Prompt:", chat_prompt)
    
    # Example form data
    form_data = {
        "goal": "Master Python programming fundamentals",
        "learning_duration": 2,
        "wake_up_time": "07:00",
        "sleep_time": "23:00",
        "focus_periods": 4,
        "break_duration": 15,
        "fixed_commitments": ["Work 9-5"],
        "intensity_level": "High",
        "peak_focus_time": "Morning",
        "habits": ["Exercise", "Meditation"],
        "rest_days": ["Sunday"],
        "additional_notes": "Need to focus on data structures and algorithms"
    }
    
    # Get enhanced prompt for form
    form_prompt = rag.process_form_data(form_data)
    print("\nForm Prompt:", form_prompt)
    
    # Update knowledge base with new information
    new_knowledge = """
    Additional Python learning strategies:
    1. Practice coding daily with small projects
    2. Use spaced repetition for learning concepts
    3. Join coding communities for support
    4. Review and refactor your code regularly
    """
    rag.update_knowledge_base(new_knowledge)
    
    # Get updated system prompt
    system_prompt = rag.get_system_prompt()
    print("\nUpdated System Prompt:", system_prompt)

if __name__ == "__main__":
    main() 