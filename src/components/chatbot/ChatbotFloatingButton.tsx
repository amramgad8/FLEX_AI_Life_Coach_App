import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Move } from 'lucide-react';
import ChatbotDialog from './ChatbotDialog';
import { useChatbotState } from './useChatbotState';

interface ChatbotFloatingButtonProps {
  initialAiModel?: string;
}

const ChatbotFloatingButton: React.FC<ChatbotFloatingButtonProps> = ({
  initialAiModel = 'gpt-4'
}) => {
  const [state, actions] = useChatbotState(initialAiModel);
  const { isOpen, messages, isTyping, activeTab, aiModel } = state;
  const { setIsOpen, toggleOpen, sendMessage, applySuggestion, setActiveTab, setAIModel, clearChat } = actions;
  
  const constraintsRef = useRef(null);
  
  const handleStartDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    // Using native drag instead of dragControls since we're already using framer-motion's drag prop
    event.stopPropagation();
  };
  
  return (
    <>
      <motion.div 
        className="fixed bottom-4 right-4 z-50"
        ref={constraintsRef}
      >
        <motion.div
          className="group relative"
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={constraintsRef}
        >
          {/* Drag handle appears when hovering over button */}
          <div 
            className={`absolute top-0 right-0 -translate-y-full p-2 mb-1 bg-gray-800 text-white rounded-md opacity-0 transition-opacity ${isOpen ? 'pointer-events-none' : 'group-hover:opacity-80'}`}
            onPointerDown={handleStartDrag}
          >
            <Move className="h-4 w-4" />
          </div>

          {/* Floating button */}
          <motion.button
            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
              isOpen ? 'bg-gray-700' : 'bg-primary'
            } relative z-10`}
            onClick={toggleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="text-white h-6 w-6" />
            ) : (
              <MessageCircle className="text-white h-6 w-6" />
            )}
          </motion.button>
          
          <div 
            className="absolute inset-0 rounded-full cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onPointerDown={handleStartDrag}
          >
            <Move className="h-4 w-4 text-white bg-gray-700/80 rounded-full p-0.5" />
          </div>
        </motion.div>

        {/* Glow effect when active */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
      
      <ChatbotDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="AI Assistant"
        initialMessage="Hi there! How can I help you today?"
        onSendMessage={sendMessage}
        onClose={() => setIsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiModel={aiModel}
        messages={messages}
        isTyping={isTyping}
        onApplySuggestion={applySuggestion}
        onAIModelChange={setAIModel}
      />
    </>
  );
};

export default ChatbotFloatingButton;