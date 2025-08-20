from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class QueryRequest(BaseModel):
    query: str
    max_results: Optional[int] = 5
    document_ids: Optional[List[str]] = None

class ContextChunk(BaseModel):
    text: str
    metadata: Dict[str, Any]
    score: float

class QueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[str]
    context_chunks: List[ContextChunk]

class DocumentInfo(BaseModel):
    document_id: str
    filename: str
    upload_date: str
    file_size: int
    file_type: str
    chunks_count: int

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks_processed: int
    message: str

class DocumentChunk(BaseModel):
    text: str
    metadata: Dict[str, Any]
    chunk_index: int