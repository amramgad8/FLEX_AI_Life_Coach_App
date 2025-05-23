
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  messages: Array<{ 
    content: string; 
    type: 'question' | 'answer' | 'plan';
    plan?: any;
  }>;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  renderMessage: (message: any, index: number) => React.ReactNode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  setInput,
  isLoading,
  onSendMessage,
  messagesEndRef,
  renderMessage
}) => {
  return (
    <Card className="border shadow-sm overflow-hidden">
      <div className="h-[600px] overflow-y-auto p-4 bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((message, index) => renderMessage(message, index))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-4 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-white">
        <form onSubmit={onSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-flex-green text-white hover:bg-flex-green-dark"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
