import { useDragControls, AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import ChatbotFloatingButton from './ChatbotFloatingButton';
import ChatbotDialog from './ChatbotDialog';
import { useChatbotState } from './useChatbotState';

const ChatbotAssistant = () => {
  const [state, actions] = useChatbotState();
  const { isOpen, messages, isTyping, activeTab, aiModel } = state;
  const { toggleOpen, sendMessage, applySuggestion, setActiveTab, setAIModel, setIsOpen } = actions;
  
  const dragControls = useDragControls();
  
  // Start drag using controls
  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragControls.start(event);
  }

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
            onSendMessage={sendMessage}
            onApplySuggestion={applySuggestion}
            onAIModelChange={setAIModel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotAssistant;