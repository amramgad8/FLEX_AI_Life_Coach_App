import { useDragControls, AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import ChatbotFloatingButton from './ChatbotFloatingButton';
import ChatbotDialog from './ChatbotDialog';
import { useChatbotState } from './useChatbotState';
import { CHAT_MODE_SYSTEM_PROMPT, CHAT_MODE_USER_PROMPT } from '../../prompts/chatModePrompt';
import { ChatService } from '../../services/chatService';

const ChatbotAssistant = () => {
  const [state, actions] = useChatbotState();
  const { isOpen, messages, isTyping, activeTab, aiModel } = state;
  const { toggleOpen, sendMessage, applySuggestion, setActiveTab, setAIModel, setIsOpen, setMessages, setInputMessage, setIsTyping } = actions;
  
  const dragControls = useDragControls();
  
  // Start drag using controls
  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragControls.start(event);
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const chatService = ChatService.getInstance();
      const response = await chatService.sendMessage([
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: inputMessage }
      ]);

      const newAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      className="fixed z-50"
      initial={{ bottom: 20, right: 20 }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    >
      <ChatbotFloatingButton initialAiModel={aiModel} />

      <AnimatePresence>
        {isOpen && (
          <ChatbotDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title="AI Assistant"
            initialMessage="Hi there! How can I help you today?"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            aiModel={aiModel}
            onClose={() => setIsOpen(false)}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onApplySuggestion={applySuggestion}
            onAIModelChange={setAIModel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotAssistant;