
import { useDragControls, AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import ChatbotFloatingButton from './ChatbotFloatingButton';
import ChatbotDialog from './ChatbotDialog';
import { useChatbotState } from './useChatbotState';

const ChatbotAssistant = () => {
  const {
    isOpen,
    messages,
    isTyping,
    activeTab,
    aiModel,
    position,
    setPosition,
    setActiveTab,
    setAiModel,
    toggleChatbot,
    handleSendMessage,
    handleApplySuggestion
  } = useChatbotState();
  
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
      onDragEnd={(e, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
    >
      <ChatbotFloatingButton 
        isOpen={isOpen} 
        onToggle={toggleChatbot} 
        startDrag={startDrag} 
      />

      <AnimatePresence>
        {isOpen && (
          <ChatbotDialog
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            aiModel={aiModel}
            onClose={toggleChatbot}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onApplySuggestion={handleApplySuggestion}
            onAIModelChange={setAiModel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotAssistant;
