import { useState, useCallback } from 'react';
import { ChatMessage, MessageType } from './types';
import { useToast } from '@/components/ui/use-toast';

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  position: { x: number; y: number };
  activeTab: string;
  aiModel: string;
}

export interface ChatbotActions {
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  sendMessage: (content: string) => Promise<string>;
  applySuggestion: (suggestion: string) => void;
  updatePosition: (x: number, y: number) => void;
  setActiveTab: (tab: string) => void;
  setAIModel: (model: string) => void;
  clearChat: () => void;
}

export function useChatbotState(initialModel = 'gpt-4'): [ChatbotState, ChatbotActions] {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    content: "Hi there! I'm your productivity assistant. How can I help you today?",
    type: 'assistant',
    timestamp: new Date().toISOString()
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('chat');
  const [aiModel, setAIModel] = useState(initialModel);
  
  const { toast } = useToast();
  
  const toggleOpen = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);
  
  const updatePosition = useCallback((x: number, y: number) => {
    setPosition({ x, y });
  }, []);
  
  const addMessage = useCallback((content: string, type: MessageType) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const sendMessage = useCallback(async (content: string): Promise<string> => {
    if (!content.trim()) return '';
    
    // Add user message
    addMessage(content, 'user');
    setIsTyping(true);
    
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on the message
      let responseContent = '';
      
      if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
        responseContent = "Hello! How can I assist you today?";
      } else if (content.toLowerCase().includes('help')) {
        responseContent = "I can help you with task management, planning your day, providing productivity tips, and answering questions. What do you need assistance with?";
      } else if (content.toLowerCase().includes('task') || content.toLowerCase().includes('todo')) {
        responseContent = "For task management, I recommend breaking down your tasks into smaller, manageable chunks. Would you like me to help you organize your tasks?";
      } else if (content.toLowerCase().includes('plan') || content.toLowerCase().includes('schedule')) {
        responseContent = "Planning your day effectively can significantly boost productivity. I suggest using time blocking to allocate focused time for important tasks. Would you like some tips on daily planning?";
      } else {
        responseContent = `I understand you're interested in "${content}". Let me help you with that. Could you provide more details about what specifically you're looking for?`;
      }
      
      // Add assistant response
      addMessage(responseContent, 'assistant');
      return responseContent;
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
      return 'Sorry, I encountered an error processing your request.';
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, toast]);
  
  const applySuggestion = useCallback((suggestion: string) => {
    sendMessage(suggestion);
    toast({
      title: "Suggestion applied",
      description: "The suggestion has been added to the chat.",
    });
  }, [sendMessage, toast]);
  
  const clearChat = useCallback(() => {
    setMessages([{
      id: Date.now().toString(),
      content: "Chat cleared. How can I help you today?",
      type: 'assistant',
      timestamp: new Date().toISOString()
    }]);
    
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  }, [toast]);
  
  // Create the state and actions objects
  const state: ChatbotState = {
    isOpen,
    messages,
    isTyping,
    position,
    activeTab,
    aiModel
  };
  
  const actions: ChatbotActions = {
    setIsOpen,
    toggleOpen,
    sendMessage,
    applySuggestion,
    updatePosition,
    setActiveTab,
    setAIModel,
    clearChat
  };
  
  // Return as a tuple array for destructuring
  return [state, actions];
}