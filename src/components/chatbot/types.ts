import { ReactNode } from 'react';

export type MessageType = 'user' | 'assistant' | 'text' | 'suggestion' | 'alert' | 'insight';

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: string | Date;
}

export interface AIModelOption {
  id: string;
  name: string;
  description: string;
  className: string;
  icon: ReactNode;
}
