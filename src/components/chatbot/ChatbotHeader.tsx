import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotHeaderProps {
  aiModel: string;
  onClose: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ aiModel, onClose }) => {
  return (
    <div className="p-3 border-b flex items-center justify-between bg-primary/5">
      <div className="flex items-center">
        <div className="text-sm font-medium">AI Assistant</div>
        <div className="ml-2 text-xs px-1.5 py-0.5 bg-primary/10 rounded-full">
          {aiModel}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="h-7 w-7"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatbotHeader;
