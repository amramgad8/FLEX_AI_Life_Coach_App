
import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatMessage } from './types';
import { ASSISTANT_RESPONSES } from './constants';

interface ChatTabProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
}

const ChatTab = ({ 
  messages, 
  isTyping, 
  onSendMessage 
}: ChatTabProps) => {
  return (
    <>
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatTab;
