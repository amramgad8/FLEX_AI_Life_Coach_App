import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { ChatService } from '../services/chatService';
import { ChatMessage } from '../types/chat';

export const useChat = () => {
  const {
    currentContext,
    isLoading,
    error,
    startNewChat,
    addMessage,
    clearChat,
    setError,
    setLoading,
  } = useChatStore();

  const chatService = ChatService.getInstance();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentContext) {
        startNewChat();
      }

      try {
        setLoading(true);
        setError(null);

        // Add user message
        const userMessage: Omit<ChatMessage, 'timestamp'> = {
          role: 'user',
          content,
        };
        addMessage(userMessage);

        // Get AI response
        const response = await chatService.sendMessage(
          currentContext?.messages || []
        );

        // Add AI response
        addMessage(response.message);

        return response;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentContext, startNewChat, addMessage, setLoading, setError]
  );

  return {
    messages: currentContext?.messages || [],
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}; 