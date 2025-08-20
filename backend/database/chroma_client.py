import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any, Optional
import logging
import uuid

logger = logging.getLogger(__name__)

class ChromaClient:
    """Client for interacting with Chroma vector database."""
    
    def __init__(self):
        self.db_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
        self.client = None
        self.collection = None
        self.collection_name = "documents"
    
    async def initialize(self):
        """Initialize the Chroma client and collection."""
        try:
            # Create persistent client
            self.client = chromadb.PersistentClient(path=self.db_path)
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            
            logger.info(f"Initialized Chroma client with collection: {self.collection_name}")
            
        except Exception as e:
            logger.error(f"Error initializing Chroma client: {str(e)}")
            raise
    
    async def add_documents(
        self, 
        document_id: str, 
        chunks: List[Dict[str, Any]], 
        embeddings: List[List[float]],
        metadata: Dict[str, Any]
    ):
        """Add document chunks to the collection."""
        try:
            if not self.collection:
                await self.initialize()
            
            # Prepare data for insertion
            ids = []
            documents = []
            metadatas = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{document_id}_{i}"
                ids.append(chunk_id)
                documents.append(chunk["text"])
                
                # Combine document metadata with chunk metadata
                chunk_metadata = {
                    **metadata,
                    **chunk["metadata"],
                    "document_id": document_id,
                    "chunk_id": chunk_id
                }
                metadatas.append(chunk_metadata)
            
            # Add to collection
            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )
            
            logger.info(f"Added {len(chunks)} chunks for document {document_id}")
            
        except Exception as e:
            logger.error(f"Error adding documents to Chroma: {str(e)}")
            raise
    
    async def query(
        self, 
        query_embedding: List[float], 
        n_results: int = 5,
        document_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Query the collection for similar documents."""
        try:
            if not self.collection:
                await self.initialize()
            
            where_clause = None
            if document_ids:
                where_clause = {"document_id": {"$in": document_ids}}
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_clause
            )
            
            return results
            
        except Exception as e:
            logger.error(f"Error querying Chroma: {str(e)}")
            raise
    
    async def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents with their metadata."""
        try:
            if not self.collection:
                await self.initialize()
            
            # Get all items from collection
            results = self.collection.get()
            
            # Group by document_id
            documents = {}
            
            for i, doc_id in enumerate(results["ids"]):
                metadata = results["metadatas"][i] if results.get("metadatas") else {}
                document_id = metadata.get("document_id")
                
                if document_id:
                    if document_id not in documents:
                        documents[document_id] = {
                            "id": document_id,
                            "metadata": {
                                "filename": metadata.get("filename", "Unknown"),
                                "upload_date": metadata.get("upload_date", ""),
                                "file_size": metadata.get("file_size", 0),
                                "file_type": metadata.get("file_type", ""),
                                "file_path": metadata.get("file_path", "")
                            },
                            "chunks_count": 0
                        }
                    
                    documents[document_id]["chunks_count"] += 1
            
            return list(documents.values())
            
        except Exception as e:
            logger.error(f"Error getting all documents: {str(e)}")
            raise
    
    async def delete_document(self, document_id: str):
        """Delete all chunks for a document."""
        try:
            if not self.collection:
                await self.initialize()
            
            # Get all chunk IDs for the document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if results["ids"]:
                self.collection.delete(ids=results["ids"])
                logger.info(f"Deleted document {document_id} and {len(results['ids'])} chunks")
            else:
                logger.warning(f"No chunks found for document {document_id}")
            
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            raise
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """Get collection statistics."""
        try:
            if not self.collection:
                await self.initialize()
            
            count = self.collection.count()
            
            return {
                "total_chunks": count,
                "collection_name": self.collection_name
            }
            
        except Exception as e:
            logger.error(f"Error getting collection stats: {str(e)}")
            return {"total_chunks": 0, "collection_name": self.collection_name}