
import { useState } from 'react';
import { PencilRuler, AlertCircle, Brain } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          message.sender === 'user'
            ? 'bg-flex-green text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none',
          message.type === 'suggestion' && message.sender === 'assistant' && 'bg-flex-green-light border border-flex-green text-gray-800',
          message.type === 'alert' && message.sender === 'assistant' && 'bg-flex-orange-light border border-flex-orange text-gray-800',
          message.type === 'insight' && message.sender === 'assistant' && 'bg-flex-yellow-light border border-flex-yellow text-gray-800'
        )}
      >
        {message.type === 'suggestion' && message.sender === 'assistant' && (
          <div className="flex items-center gap-1 mb-1 text-xs text-flex-green font-medium">
            <PencilRuler className="h-3 w-3" /> Suggestion
          </div>
        )}
        {message.type === 'alert' && message.sender === 'assistant' && (
          <div className="flex items-center gap-1 mb-1 text-xs text-flex-orange font-medium">
            <AlertCircle className="h-3 w-3" /> Alert
          </div>
        )}
        {message.type === 'insight' && message.sender === 'assistant' && (
          <div className="flex items-center gap-1 mb-1 text-xs text-flex-yellow font-medium">
            <Brain className="h-3 w-3" /> Insight
          </div>
        )}
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;