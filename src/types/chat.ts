export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: ChatMessage;
  knowledgeBaseContext?: string;
  suggestedActions?: string[];
}

export interface ChatContext {
  messages: ChatMessage[];
  sessionId: string;
  startTime: number;
  lastUpdated: number;
}

export interface ChatState {
  currentContext: ChatContext | null;
  isLoading: boolean;
  error: string | null;
} 