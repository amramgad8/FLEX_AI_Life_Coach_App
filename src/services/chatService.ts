import { ChatMessage, ChatResponse } from '../types/chat';
import { getRelevantKnowledge, getKnowledgeBaseBooks } from './knowledgeService';
import { extractUserProfileFromChat } from '../utils/extractUserProfileFromChat';

export class ChatService {
  private static instance: ChatService;
  private apiEndpoint: string;

  private constructor() {
    this.apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8000';
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(
    messages: ChatMessage[],
    onProgress?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      // Get relevant knowledge based on the conversation context
      const knowledgeBase = await getRelevantKnowledge(messages);
      
      // Get available knowledge base books
      const availableBooks = await getKnowledgeBaseBooks();

      // Prepare the messages for the API (no system prompt, let backend handle it)
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Make the API call
      const response = await fetch(`${this.apiEndpoint}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          knowledgeBase,
          availableBooks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();
      return {
        message: {
          role: 'assistant',
          content: data.message,
          timestamp: Date.now(),
        },
        knowledgeBaseContext: data.knowledgeBaseContext,
        suggestedActions: data.suggestedActions,
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  }

  async generatePlanFromChat(messages: ChatMessage[]): Promise<any> {
    try {
      // Get relevant knowledge and books for plan generation
      const knowledgeBase = await getRelevantKnowledge(messages);
      const availableBooks = await getKnowledgeBaseBooks();
      const userProfile = extractUserProfileFromChat(messages);

      const response = await fetch(`${this.apiEndpoint}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          knowledgeBase,
          availableBooks,
          context: messages.map(msg => msg.content).join('\n'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan from chat');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating plan from chat:', error);
      throw error;
    }
  }
} 