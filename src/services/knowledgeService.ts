import { ChatMessage } from '../types/chat';

interface KnowledgeBaseEntry {
  content: string;
  source: string;
  relevance: number;
}

export async function getRelevantKnowledge(messages: ChatMessage[]): Promise<string> {
  try {
    // Get the last user message for context
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    // Query the RAG system for relevant knowledge
    const response = await fetch('/api/rag/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: lastUserMessage,
        context: messages.map(msg => msg.content).join('\n'),
        limit: 5 // Get top 5 most relevant entries
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to query RAG system');
    }

    const knowledgeEntries: KnowledgeBaseEntry[] = await response.json();

    // Format the knowledge base entries
    const formattedKnowledge = knowledgeEntries
      .map(entry => `[${entry.source}] ${entry.content}`)
      .join('\n\n');

    // Add general productivity tips if no specific knowledge was found
    if (!formattedKnowledge) {
      return `Productivity Tips:
1. Break down large tasks into smaller, manageable chunks
2. Use the Pomodoro Technique for focused work sessions
3. Prioritize tasks using the Eisenhower Matrix
4. Take regular breaks to maintain focus and prevent burnout
5. Set clear, specific goals with deadlines`;
    }

    return formattedKnowledge;
  } catch (error) {
    console.error('Error getting relevant knowledge:', error);
    return '';
  }
}

export async function getKnowledgeBaseBooks(): Promise<string[]> {
  try {
    const response = await fetch('/api/rag/books');
    if (!response.ok) {
      throw new Error('Failed to fetch knowledge base books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching knowledge base books:', error);
    return [];
  }
} 