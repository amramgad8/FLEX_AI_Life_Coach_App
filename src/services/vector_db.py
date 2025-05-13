import faiss
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict, Any
import os
import pickle
from .config import Config

class VectorDatabase:
    def __init__(self, config: Config):
        self.config = config
        # Initialize TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)  # Use both unigrams and bigrams
        )
        
        # Initialize FAISS index
        self.dimension = 1000  # Dimension for TF-IDF vectors
        self.index = None  # Will be initialized when we add documents
        
        # Store documents and metadata
        self.documents = []
        self.metadata = []
        
        # Create directory for persistence
        os.makedirs("vector_db", exist_ok=True)
    
    def add_documents(self, chunks: List[str], metadata: List[Dict[str, Any]] = None):
        """
        Add document chunks to the FAISS index.
        
        Args:
            chunks (List[str]): List of text chunks
            metadata (List[Dict[str, Any]], optional): List of metadata for each chunk
        """
        if metadata is None:
            metadata = [{"source": "unknown"} for _ in chunks]
            
        # Generate TF-IDF embeddings
        embeddings = self.vectorizer.fit_transform(chunks).toarray()
        
        # Initialize FAISS index if not already done
        if self.index is None:
            self.index = faiss.IndexFlatL2(embeddings.shape[1])
        
        # Add to FAISS index
        self.index.add(embeddings.astype('float32'))
        
        # Store documents and metadata
        self.documents.extend(chunks)
        self.metadata.extend(metadata)
        
        if self.config.debug_mode:
            print(f"Added {len(chunks)} chunks to FAISS index")
            print(f"Vector dimension: {embeddings.shape[1]}")
    
    def search(self, query: str, n_results: int = 5) -> Dict[str, Any]:
        """
        Search for relevant chunks in the FAISS index.
        
        Args:
            query (str): Search query
            n_results (int): Number of results to return
            
        Returns:
            Dict[str, Any]: Dictionary containing relevant chunks and metadata
        """
        if not self.documents:
            return {'documents': [], 'metadatas': [], 'distances': []}
            
        # Generate query embedding
        query_embedding = self.vectorizer.transform([query]).toarray()
        
        # Search in FAISS index
        distances, indices = self.index.search(
            query_embedding.astype('float32'), 
            n_results
        )
        
        # Prepare results
        results = {
            'documents': [self.documents[idx] for idx in indices[0]],
            'metadatas': [self.metadata[idx] for idx in indices[0]],
            'distances': distances[0].tolist()
        }
        
        return results
    
    def save(self, path: str = "vector_db"):
        """Save the FAISS index and associated data."""
        if self.index is not None:
            # Save FAISS index
            faiss.write_index(self.index, os.path.join(path, "index.faiss"))
            
            # Save vectorizer
            with open(os.path.join(path, "vectorizer.pkl"), "wb") as f:
                pickle.dump(self.vectorizer, f)
            
            # Save documents and metadata
            with open(os.path.join(path, "documents.pkl"), "wb") as f:
                pickle.dump(self.documents, f)
            with open(os.path.join(path, "metadata.pkl"), "wb") as f:
                pickle.dump(self.metadata, f)
    
    def load(self, path: str = "vector_db"):
        """Load the FAISS index and associated data."""
        # Load FAISS index
        self.index = faiss.read_index(os.path.join(path, "index.faiss"))
        
        # Load vectorizer
        with open(os.path.join(path, "vectorizer.pkl"), "rb") as f:
            self.vectorizer = pickle.load(f)
        
        # Load documents and metadata
        with open(os.path.join(path, "documents.pkl"), "rb") as f:
            self.documents = pickle.load(f)
        with open(os.path.join(path, "metadata.pkl"), "rb") as f:
            self.metadata = pickle.load(f) 