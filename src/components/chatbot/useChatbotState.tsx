
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from './types';
import { ASSISTANT_RESPONSES } from './constants';

export const useChatbotState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newUserMessage: ChatMessage = {
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
      const newAssistantMessage: ChatMessage = {
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
    const newUserMessage: ChatMessage = {
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
      const confirmationMessage: ChatMessage = {
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

  return {
    isOpen,
    messages,
    isTyping,
    activeTab,
    aiModel,
    position,
    setPosition,
    setActiveTab,
    setAiModel,
    toggleChatbot,
    handleSendMessage,
    handleApplySuggestion
  };
};
