import os
from dotenv import load_dotenv

class Config:
    def __init__(self):
        load_dotenv() # Ensure .env is loaded if not already
        # Load configuration from environment variables
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        self.chunk_size = int(os.getenv('CHUNK_SIZE', 1000))
        self.chunk_overlap = int(os.getenv('CHUNK_OVERLAP', 200))
        self.debug_mode = os.getenv('DEBUG_MODE', 'False').lower() == 'true'
        
    def __str__(self):
        return f"Configuration:\nGoogle API Key: {'Set' if self.google_api_key else 'Not Set'}\nChunk Size: {self.chunk_size}\nChunk Overlap: {self.chunk_overlap}\nDebug Mode: {self.debug_mode}"