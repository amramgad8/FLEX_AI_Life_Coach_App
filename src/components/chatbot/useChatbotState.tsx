
import { useState, useCallback } from 'react';
import { ChatMessage } from './types';
import { useToast } from '@/hooks/use-toast';
import { ChatService } from '../../services/chatService';

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  position: { x: number; y: number };
  activeTab: string;
  aiModel: string;
  inputMessage: string;
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
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  setInputMessage: (message: string) => void;
  setIsTyping: (typing: boolean) => void;
}

export function useChatbotState(initialModel = 'gpt-4'): [ChatbotState, ChatbotActions] {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('chat');
  const [aiModel, setAIModel] = useState(initialModel);
  const [inputMessage, setInputMessage] = useState('');
  
  const { toast } = useToast();
  
  const toggleOpen = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);
  
  const updatePosition = useCallback((x: number, y: number) => {
    setPosition({ x, y });
  }, []);
  
  const addMessage = useCallback((content: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type: 'text'
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
      const chatService = ChatService.getInstance();
      const response = await chatService.sendMessage([
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
          timestamp: Date.now()
        })),
        { role: 'user' as const, content, timestamp: Date.now() }
      ]);

      // Add assistant response
      addMessage(response.message.content, 'assistant');
      return response.message.content;
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = "I apologize, but I encountered an error. Please try again.";
      addMessage(errorMessage, 'assistant');
      return errorMessage;
    } finally {
      setIsTyping(false);
    }
  }, [messages, addMessage]);
  
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
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
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
    aiModel,
    inputMessage
  };
  
  const actions: ChatbotActions = {
    setIsOpen,
    toggleOpen,
    sendMessage,
    applySuggestion,
    updatePosition,
    setActiveTab,
    setAIModel,
    clearChat,
    setMessages,
    setInputMessage,
    setIsTyping
  };
  
  // Return as a tuple array for destructuring
  return [state, actions];
}
