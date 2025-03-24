
import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  type: 'question' | 'answer';
}

const ChatMessage = ({ content, type }: ChatMessageProps) => {
  if (!content) {
    return null; // Don't render anything if content is empty
  }
  
  return (
    <div className={`flex ${type === 'answer' ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        flex items-start max-w-[80%] rounded-2xl p-3.5 
        ${type === 'answer' 
          ? 'bg-flex-green text-white rounded-br-none ml-auto' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }
      `}>
        {type === 'question' && (
          <Bot className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-flex-green" />
        )}
        {type === 'answer' && (
          <User className="h-5 w-5 ml-2 mt-0.5 shrink-0 order-2 text-white" />
        )}
        <span className={`text-sm ${type === 'answer' ? 'mr-2' : 'ml-2'}`}>{content}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
