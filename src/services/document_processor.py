from pathlib import Path
from typing import List, Dict, Any
import PyPDF2
import docx
from ..models.config import Config

class DocumentProcessor:
    def __init__(self, config: Config):
        self.config = config
        self.supported_formats = {
            '.pdf': self._process_pdf,
            '.docx': self._process_docx,
            '.txt': self._process_txt
        }
    
    def process_document(self, file_path: str) -> List[str]:
        """Process a document and return its content in chunks."""
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
            
        file_extension = file_path.suffix.lower()
        if file_extension not in self.supported_formats:
            raise ValueError(f"Unsupported file format: {file_extension}")
            
        content = self.supported_formats[file_extension](file_path)
        chunks = self._create_chunks(content)
        
        if self.config.debug_mode:
            print(f"Processed {file_path.name}")
            print(f"Created {len(chunks)} chunks")
            
        return chunks
    
    def _process_pdf(self, file_path: Path) -> str:
        """Extract text from PDF file."""
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    
    def _process_docx(self, file_path: Path) -> str:
        """Extract text from Word document."""
        doc = docx.Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    def _process_txt(self, file_path: Path) -> str:
        """Extract text from plain text file."""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def _create_chunks(self, text: str) -> List[str]:
        """Split text into overlapping chunks."""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + self.config.chunk_size
            if start > 0:
                start = start - self.config.chunk_overlap
            chunk = text[start:end]
            chunks.append(chunk)
            start = end
            
        return chunks 