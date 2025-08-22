import asyncio
from typing import Dict, List, Any, Tuple
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.services.pdf_service import PDFService, DocumentChunk
from app.services.llm_service import (
    get_openai_response, get_claude_response, 
    get_gemini_response, get_mistral_response
)
from app.services.embedding_service import get_embedding, get_embeddings_batch

class SummarizationService:
    def __init__(self):
        self.pdf_service = PDFService()
    
    async def get_llm_summary(self, model_func, model_name: str, document_text: str, user_prompt: str) -> Tuple[str, str]:
        """Get summary from a specific LLM."""
        # Construct the full prompt for summarization
        full_prompt = f"""
Please provide a comprehensive summary of the following document based on this request: "{user_prompt}"

Document to summarize:
{document_text}

Instructions:
- Focus on the key points relevant to the user's request
- Maintain factual accuracy and avoid adding information not present in the document
- Provide a clear, well-structured summary
- If the document doesn't contain relevant information for the request, state that clearly

Summary:"""
        
        return await model_func(full_prompt)
    
    async def get_all_summaries(self, document_text: str, user_prompt: str) -> Dict[str, str]:
        """Get summaries from all LLMs for the given document."""
        tasks = [
            self.get_llm_summary(get_openai_response, "openai", document_text, user_prompt),
            self.get_llm_summary(get_claude_response, "claude", document_text, user_prompt),
            self.get_llm_summary(get_gemini_response, "gemini", document_text, user_prompt),
            self.get_llm_summary(get_mistral_response, "mistral", document_text, user_prompt),
        ]
        
        results = await asyncio.gather(*tasks)
        return {model: response for model, response in results}
    
    async def calculate_summary_similarities(self, original_text: str, summaries: Dict[str, str]) -> Dict[str, float]:
        """
        Calculate cosine similarities between the original document and each summary.
        Higher similarity = less hallucination (more faithful to original content).
        """
        # Get valid summaries (non-error responses)
        valid_summaries = {model: summary for model, summary in summaries.items() 
                          if not summary.startswith("Error:")}
        
        # Initialize similarities with 0.0 for error responses
        similarities = {model: 0.0 for model in summaries if model not in valid_summaries}
        
        if not valid_summaries:
            return similarities
        
        try:
            # Get embedding for the original document
            original_embedding = await get_embedding(original_text)
            
            # Get embeddings for all valid summaries
            summary_texts = list(valid_summaries.values())
            summary_embeddings = await get_embeddings_batch(summary_texts)
            
            # Calculate similarities between original document and each summary
            for (model, _), summary_embedding in zip(valid_summaries.items(), summary_embeddings):
                similarity = cosine_similarity(
                    np.array(original_embedding).reshape(1, -1),
                    np.array(summary_embedding).reshape(1, -1)
                )[0][0]
                similarities[model] = similarity
                
        except Exception as e:
            # If anything fails, set all valid responses to 0.0
            similarities.update({model: 0.0 for model in valid_summaries})
        
        return similarities
    
    async def process_chunked_document(self, chunks: List[DocumentChunk], user_prompt: str) -> Dict[str, Any]:
        """
        Process a chunked document by summarizing each chunk and then creating a final summary.
        """
        chunk_summaries = []
        
        # Summarize each chunk
        for chunk in chunks:
            chunk_summary_dict = await self.get_all_summaries(chunk.content, user_prompt)
            
            # Calculate similarities for this chunk
            similarities = await self.calculate_summary_similarities(chunk.content, chunk_summary_dict)
            
            # Find best summary for this chunk
            if similarities:
                best_model = max(similarities.items(), key=lambda x: x[1])[0]
                best_summary = chunk_summary_dict[best_model]
            else:
                best_model = "fallback"
                best_summary = f"Unable to summarize chunk {chunk.chunk_index}"
            
            chunk_summaries.append({
                "chunk_index": chunk.chunk_index,
                "best_summary": best_summary,
                "best_model": best_model,
                "similarity_score": similarities.get(best_model, 0.0),
                "all_summaries": chunk_summary_dict,
                "similarities": similarities
            })
        
        # Combine all chunk summaries into a final document
        combined_summary_text = "\n\n".join([
            f"Section {cs['chunk_index'] + 1}: {cs['best_summary']}" 
            for cs in chunk_summaries
        ])
        
        # Create a final summary from the combined chunk summaries
        final_prompt = f"Please create a cohesive summary from these section summaries: {user_prompt}"
        final_summaries = await self.get_all_summaries(combined_summary_text, final_prompt)
        final_similarities = await self.calculate_summary_similarities(combined_summary_text, final_summaries)
        
        # Find the best final summary
        if final_similarities:
            best_final_model = max(final_similarities.items(), key=lambda x: x[1])[0]
        else:
            best_final_model = list(final_summaries.keys())[0] if final_summaries else "fallback"
        
        return {
            "processing_type": "chunked",
            "num_chunks": len(chunks),
            "chunk_summaries": chunk_summaries,
            "final_summary": {
                "best_response": final_summaries.get(best_final_model, "Unable to create final summary"),
                "best_model": best_final_model,
                "similarity_score": final_similarities.get(best_final_model, 0.0),
                "all_responses": final_summaries,
                "similarities": final_similarities
            }
        }
    
    async def summarize_document(self, pdf_content: bytes, user_prompt: str) -> Dict[str, Any]:
        """
        Main method to summarize a PDF document.
        
        Process:
        1. Extract text and chunk if necessary
        2. For each chunk (or the whole document), get summaries from all LLMs
        3. Calculate similarity between original content and summaries
        4. Return the summary with highest similarity (least hallucination)
        """
        # Prepare the document
        doc_data = self.pdf_service.prepare_document_for_summarization(pdf_content, user_prompt)
        
        full_text = doc_data["full_text"]
        chunks = doc_data["chunks"]
        metadata = doc_data["metadata"]
        
        if metadata["needs_chunking"]:
            # Process large document in chunks
            result = await self.process_chunked_document(chunks, user_prompt)
        else:
            # Process small document as a single unit
            summaries = await self.get_all_summaries(full_text, user_prompt)
            similarities = await self.calculate_summary_similarities(full_text, summaries)
            
            # Find best summary
            if similarities:
                best_model = max(similarities.items(), key=lambda x: x[1])[0]
            else:
                best_model = list(summaries.keys())[0] if summaries else "fallback"
            
            result = {
                "processing_type": "single",
                "num_chunks": 1,
                "best_response": summaries.get(best_model, "Unable to create summary"),
                "best_model": best_model,
                "similarity_score": similarities.get(best_model, 0.0),
                "all_responses": summaries,
                "similarities": similarities
            }
        
        # Add metadata
        result["metadata"] = metadata
        
        return result 