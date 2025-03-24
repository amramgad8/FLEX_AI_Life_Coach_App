
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MessageCircle, X, Move } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { ChatMessage as ChatMessageType } from './types';
import { ASSISTANT_RESPONSES } from './constants';
import ChatbotHeader from './ChatbotHeader';
import ChatTab from './ChatTab';
import InsightsTab from './InsightsTab';
import SettingsTab from './SettingsTab';

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      content: "Hi there! I'm Flex Assistant. How can I help with your tasks today?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [aiModel, setAiModel] = useState<string>("default");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Start drag using controls
  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragControls.start(event);
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newUserMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);
    
    // Simulate assistant response with typing indicator
    setTimeout(() => {
      const randomResponse = ASSISTANT_RESPONSES[Math.floor(Math.random() * ASSISTANT_RESPONSES.length)];
      const newAssistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: randomResponse.type
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleApplySuggestion = (suggestion: string) => {
    const newUserMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: suggestion,
      sender: 'user',
      timestamp: new Date(),
      type: 'suggestion'
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    
    toast({
      title: "Suggestion Applied",
      description: "We'll implement this productivity tip for you.",
    });
    
    // Simulate assistant confirmation
    setIsTyping(true);
    setTimeout(() => {
      const confirmationMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: `I've noted your interest in: "${suggestion}". Would you like me to provide more details?`,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages((prev) => [...prev, confirmationMessage]);
      setIsTyping(false);
    }, 1000);
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
      onDragEnd={(e, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
    >
      {/* Drag handle appears when hovering over button */}
      <div 
        className={`absolute top-0 right-0 -translate-y-full p-2 mb-1 bg-gray-800 text-white rounded-md opacity-0 transition-opacity ${isOpen ? 'pointer-events-none' : 'group-hover:opacity-80'}`}
        onPointerDown={startDrag}
      >
        <Move className="h-4 w-4" />
      </div>

      {/* Floating button */}
      <motion.div className="group relative">
        <motion.button
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
            isOpen ? 'bg-gray-700' : 'bg-flex-gradient'
          } relative z-10`}
          onClick={toggleChatbot}
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
          onPointerDown={startDrag}
        >
          <Move className="h-4 w-4 text-white bg-gray-700/80 rounded-full p-0.5" />
        </div>
      </motion.div>

      {/* Glow effect when active */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 bg-flex-green/20 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-80 md:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border border-gray-200 overflow-hidden">
              <ChatbotHeader aiModel={aiModel} onClose={toggleChatbot} />
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full rounded-none">
                    <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                    <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat">
                    <ChatTab 
                      messages={messages}
                      isTyping={isTyping}
                      onSendMessage={handleSendMessage}
                    />
                  </TabsContent>
                  
                  <TabsContent value="insights">
                    <InsightsTab onApplySuggestion={handleApplySuggestion} />
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <SettingsTab aiModel={aiModel} onAIModelChange={setAiModel} />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotAssistant;
