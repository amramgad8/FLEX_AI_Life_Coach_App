
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import MessageRenderer from './components/MessageRenderer';
import { useChatMessages } from './hooks/useChatMessages';

interface AIPlannerChatProps {
  onUpdatePreferences: (message: string, history: any[], context: any) => Promise<{ message: string; plan?: any; context?: any; history?: any[]; plan_confirmed?: boolean }>;
  onComplete: () => void;
  onAddTask: (task: any) => void;
  onAddAllTasks: (milestone: any) => void;
  onModifyPlan: () => void;
}

const AIPlannerChat = ({ 
  onUpdatePreferences, 
  onComplete, 
  onAddTask, 
  onAddAllTasks, 
  onModifyPlan 
}: AIPlannerChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    messages,
    input,
    setInput,
    isLoading,
    editingKey,
    messagesEndRef,
    handleSavePlan,
    handleSendMessage,
    initializeChat
  } = useChatMessages(onUpdatePreferences);

  const toggleChat = () => {
    if (!isOpen) {
      initializeChat();
    }
    setIsOpen(!isOpen);
  };

  const renderMessage = (message: any, index: number) => (
    <MessageRenderer
      key={index}
      message={message}
      index={index}
      editingKey={editingKey}
      onAddTask={onAddTask}
      onAddAllTasks={onAddAllTasks}
      onModifyPlan={onModifyPlan}
      onSavePlan={handleSavePlan}
    />
  );

  return (
    <div className="relative">
      <Button 
        onClick={toggleChat} 
        className="w-full bg-flex-green hover:bg-flex-green-dark"
      >
        <Bot className="mr-2 h-5 w-5" />
        {isOpen ? "Close Chat" : "Start Planning Chat"}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <ChatInterface
              messages={messages}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
              renderMessage={renderMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPlannerChat;
