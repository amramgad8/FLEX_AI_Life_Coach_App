
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="p-3 border-t">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask about your tasks..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-flex-green text-white hover:bg-flex-green-dark"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
