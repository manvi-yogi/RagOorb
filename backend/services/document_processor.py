import os
import asyncio
from typing import List, Dict, Any
from pathlib import Path
import logging

# Document processing imports
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    from docx import Document
except ImportError:
    Document = None

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Service for processing various document types."""
    
    def __init__(self):
        self.max_chunk_size = 1000
        self.chunk_overlap = 200
    
    async def process_document(self, file_path: str, filename: str) -> List[Dict[str, Any]]:
        """Process a document and return chunks."""
        try:
            file_extension = Path(file_path).suffix.lower()
            
            if file_extension == ".pdf":
                text = await self._extract_pdf_text(file_path)
            elif file_extension == ".docx":
                text = await self._extract_docx_text(file_path)
            elif file_extension in [".txt", ".md"]:
                text = await self._extract_text_file(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            if not text.strip():
                raise ValueError("No text content found in document")
            
            # Split text into chunks
            chunks = self._split_text_into_chunks(text, filename)
            
            return chunks
            
        except Exception as e:
            logger.error(f"Error processing document {filename}: {str(e)}")
            raise
    
    async def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF file."""
        if not PyPDF2:
            raise ImportError("PyPDF2 is required for PDF processing")
        
        def extract_text():
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        
        return await asyncio.get_event_loop().run_in_executor(None, extract_text)
    
    async def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX file."""
        if not Document:
            raise ImportError("python-docx is required for DOCX processing")
        
        def extract_text():
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        
        return await asyncio.get_event_loop().run_in_executor(None, extract_text)
    
    async def _extract_text_file(self, file_path: str) -> str:
        """Extract text from plain text file."""
        def extract_text():
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        
        return await asyncio.get_event_loop().run_in_executor(None, extract_text)
    
    def _split_text_into_chunks(self, text: str, filename: str) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks."""
        chunks = []
        words = text.split()
        
        if not words:
            return chunks
        
        chunk_size_words = self.max_chunk_size // 6  # Approximate words per chunk
        overlap_words = self.chunk_overlap // 6     # Approximate overlap words
        
        for i in range(0, len(words), chunk_size_words - overlap_words):
            chunk_words = words[i:i + chunk_size_words]
            chunk_text = " ".join(chunk_words)
            
            if chunk_text.strip():
                chunks.append({
                    "text": chunk_text,
                    "metadata": {
                        "filename": filename,
                        "chunk_index": len(chunks),
                        "start_word": i,
                        "end_word": min(i + chunk_size_words, len(words)),
                        "word_count": len(chunk_words)
                    },
                    "chunk_index": len(chunks)
                })
        
        return chunks