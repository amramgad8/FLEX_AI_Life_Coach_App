import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage } from './types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatTabProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  isTyping,
  onSendMessage 
}) => {
  const [inputValue, setInputValue] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[350px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex max-w-[80%] rounded-lg p-3",
                message.type === 'user' 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-muted"
              )}
            >
              {message.content}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted rounded-lg p-3 max-w-[80%]"
            >
              <span className="flex space-x-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-75">•</span>
                <span className="animate-bounce delay-150">•</span>
              </span>
            </motion.div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
