import { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'alert' | 'insight';
}

export interface AIModelOption {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: string;
  className: string;
}
