
import { useDragControls, AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import ChatbotFloatingButton from './ChatbotFloatingButton';
import ChatbotDialog from './ChatbotDialog';
import { useChatbotState } from './useChatbotState';
import { ChatMessage } from './types';
import { ChatService } from '../../services/chatService';

const ChatbotAssistant = () => {
  const [state, actions] = useChatbotState();
  const { isOpen, messages, isTyping, activeTab, aiModel, inputMessage } = state;
  const { toggleOpen, sendMessage, applySuggestion, setActiveTab, setAIModel, setIsOpen, setMessages, setInputMessage, setIsTyping } = actions;
  
  const dragControls = useDragControls();
  
  // Start drag using controls
  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragControls.start(event);
  }

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!message.trim()) return '';
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);
    
    try {
      const chatService = ChatService.getInstance();
      const response = await chatService.sendMessage([
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
          timestamp: Date.now()
        })),
        { role: 'user' as const, content: message, timestamp: Date.now() }
      ]);

      const newAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages((prev) => [...prev, newAssistantMessage]);
      return response.message.content;
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
      return errorMessage.content;
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
