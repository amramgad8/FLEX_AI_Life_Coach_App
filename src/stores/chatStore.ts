import { create } from 'zustand';
import { ChatMessage } from '../types/chat';

interface ChatContext {
  messages: ChatMessage[];
  metadata?: {
    title?: string;
    tags?: string[];
    lastUpdated?: number;
  };
}

interface ChatStore {
  currentContext: ChatContext | null;
  isLoading: boolean;
  error: string | null;
  startNewChat: () => void;
  addMessage: (message: Omit<ChatMessage, 'timestamp'>) => void;
  clearChat: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateContextMetadata: (metadata: Partial<ChatContext['metadata']>) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentContext: null,
  isLoading: false,
  error: null,

  startNewChat: () => {
    set({
      currentContext: {
        messages: [],
        metadata: {
          lastUpdated: Date.now(),
        },
      },
      error: null,
    });
  },

  addMessage: (message) => {
    set((state) => {
      if (!state.currentContext) {
        return state;
      }

      const newMessage: ChatMessage = {
        ...message,
        timestamp: Date.now(),
      };

      return {
        currentContext: {
          ...state.currentContext,
          messages: [...state.currentContext.messages, newMessage],
          metadata: {
            ...state.currentContext.metadata,
            lastUpdated: Date.now(),
          },
        },
      };
    });
  },

  clearChat: () => {
    set({
      currentContext: null,
      error: null,
    });
  },

  setError: (error) => {
    set({ error });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  updateContextMetadata: (metadata) => {
    set((state) => {
      if (!state.currentContext) {
        return state;
      }

      return {
        currentContext: {
          ...state.currentContext,
          metadata: {
            ...state.currentContext.metadata,
            ...metadata,
            lastUpdated: Date.now(),
          },
        },
      };
    });
  },
})); 