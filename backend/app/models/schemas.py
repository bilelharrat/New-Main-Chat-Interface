from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class QueryRequest(BaseModel):
    prompt: str

class QueryResponse(BaseModel):
    best_response: str
    best_model: str
    similarity_score: float
    all_responses: Dict[str, str]
    similarities: Dict[str, float]

class SummarizationRequest(BaseModel):
    prompt: str

class ChunkSummary(BaseModel):
    chunk_index: int
    best_summary: str
    best_model: str
    similarity_score: float
    all_summaries: Dict[str, str]
    similarities: Dict[str, float]

class DocumentMetadata(BaseModel):
    total_tokens: int
    prompt_tokens: int
    num_chunks: int
    needs_chunking: bool
    avg_chunk_tokens: float

class SummarizationResponse(BaseModel):
    processing_type: str  # "single" or "chunked"
    num_chunks: int
    best_response: Optional[str] = None
    best_model: Optional[str] = None
    similarity_score: Optional[float] = None
    all_responses: Optional[Dict[str, str]] = None
    similarities: Optional[Dict[str, float]] = None
    chunk_summaries: Optional[List[ChunkSummary]] = None
    final_summary: Optional[Dict[str, Any]] = None
    metadata: DocumentMetadata 