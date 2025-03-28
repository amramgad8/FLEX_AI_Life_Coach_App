import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, Settings } from 'lucide-react';
import ChatTab from './ChatTab';
import InsightsTab from './InsightsTab';
import SettingsTab from './SettingsTab';
import ChatbotHeader from './ChatbotHeader';

interface ChatbotDialogProps {
  title: string;
  initialMessage: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage: (message: string) => Promise<string>;
  onClose?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  aiModel?: string;
  messages?: any[];
  isTyping?: boolean;
  onApplySuggestion?: (suggestion: string) => void;
  onAIModelChange?: (model: string) => void;
}

const ChatbotDialog: React.FC<ChatbotDialogProps> = ({
  title = 'AI Assistant',
  initialMessage,
  open,
  onOpenChange,
  onSendMessage,
  onClose = () => onOpenChange(false),
  activeTab = 'chat',
  setActiveTab = () => {},
  aiModel = 'gpt-4',
  messages = [],
  isTyping = false,
  onApplySuggestion = () => {},
  onAIModelChange = () => {},
}) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed bottom-20 right-4 z-50 w-80 md:w-96"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="p-0">
          <ChatbotHeader aiModel={aiModel} onClose={onClose} />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 h-10">
              <TabsTrigger value="chat" className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-1 text-xs">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 text-xs">
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="m-0">
              <ChatTab 
                messages={messages} 
                isTyping={isTyping} 
                onSendMessage={onSendMessage} 
              />
            </TabsContent>
            
            <TabsContent value="insights" className="m-0">
              <div className="p-4 h-[350px] overflow-y-auto">
                <InsightsTab onApplySuggestion={onApplySuggestion} />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <div className="p-4 h-[350px] overflow-y-auto">
                <SettingsTab 
                  aiModel={aiModel} 
                  onAIModelChange={onAIModelChange} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="p-2 text-xs text-muted-foreground border-t bg-muted/50">
          <p>Powered by AI | Privacy protected</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChatbotDialog;