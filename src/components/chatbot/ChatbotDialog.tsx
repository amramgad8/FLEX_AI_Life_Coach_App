
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatbotHeader from './ChatbotHeader';
import ChatTab from './ChatTab';
import InsightsTab from './InsightsTab';
import SettingsTab from './SettingsTab';
import { ChatMessage } from './types';

interface ChatbotDialogProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiModel: string;
  onClose: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onApplySuggestion: (suggestion: string) => void;
  onAIModelChange: (modelId: string) => void;
}

const ChatbotDialog = ({
  activeTab,
  setActiveTab,
  aiModel,
  onClose,
  messages,
  isTyping,
  onSendMessage,
  onApplySuggestion,
  onAIModelChange
}: ChatbotDialogProps) => {
  return (
    <motion.div
      className="absolute bottom-16 right-0 w-80 md:w-96"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="shadow-xl border border-gray-200 overflow-hidden">
        <ChatbotHeader aiModel={aiModel} onClose={onClose} />
        
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
                onSendMessage={onSendMessage}
              />
            </TabsContent>
            
            <TabsContent value="insights">
              <InsightsTab onApplySuggestion={onApplySuggestion} />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab aiModel={aiModel} onAIModelChange={onAIModelChange} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChatbotDialog;
