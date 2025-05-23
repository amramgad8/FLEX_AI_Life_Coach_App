import { Router } from 'express';
import { vectorStore } from '../services/vectorStore';
import { loadKnowledgeBase } from '../services/knowledgeBaseLoader';

const router = Router();

// Initialize knowledge base
const knowledgeBase = loadKnowledgeBase();

// Query endpoint for RAG
router.post('/query', async (req, res) => {
  try {
    const { query, context, limit = 5 } = req.body;

    // Search the vector store for relevant entries
    const results = await vectorStore.search(query, {
      filter: {
        context: context || '',
      },
      limit,
    });

    // Format and return the results
    const formattedResults = results.map(result => ({
      content: result.content,
      source: result.metadata.source,
      relevance: result.score,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error in RAG query:', error);
    res.status(500).json({ error: 'Failed to query knowledge base' });
  }
});

// Get available knowledge base books
router.get('/books', async (req, res) => {
  try {
    const books = knowledgeBase.getAvailableBooks();
    res.json(books);
  } catch (error) {
    console.error('Error fetching knowledge base books:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base books' });
  }
});

export default router; 