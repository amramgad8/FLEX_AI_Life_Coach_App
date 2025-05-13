from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Config(BaseModel):
    chunk_size: int = int(os.getenv('CHUNK_SIZE', 1000))
    chunk_overlap: int = int(os.getenv('CHUNK_OVERLAP', 200))
    debug_mode: bool = os.getenv('DEBUG_MODE', 'False').lower() == 'true'
    google_api_key: str = os.getenv('GOOGLE_API_KEY', '')
    
    class Config:
        env_file = ".env" 