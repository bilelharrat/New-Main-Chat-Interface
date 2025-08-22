import time
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
import asyncio

from app.models.schemas import QueryRequest, QueryResponse, SummarizationRequest, SummarizationResponse
from app.services.llm_service import get_all_llm_responses
from app.services.embedding_service import get_embedding, calculate_similarities, get_embeddings_batch, calculate_cosine_similarities
from app.services.summarization_service import SummarizationService
from app.services.telemetry_service import telemetry, TelemetryService

# Import new hierarchical services
from app.services.enhanced_pdf_service import EnhancedPDFService
from app.services.hierarchical_summarizer import HierarchicalSummarizer, HierarchicalSummaryResult

router = APIRouter()
telemetry_service = TelemetryService()
summarization_service = SummarizationService()

# Initialize new hierarchical services
enhanced_pdf_service = EnhancedPDFService()
hierarchical_summarizer = HierarchicalSummarizer()

def customize_prompt_for_mode(prompt: str, mode: str) -> str:
    """
    Customize the prompt based on the selected mode.
    
    Args:
        prompt: Original user prompt
        mode: Selected mode (e.g., "Auto Selection", "Research", "Coding", etc.)
    
    Returns:
        Enhanced prompt with mode-specific instructions
    """
    if mode == "Auto Selection":
        return prompt  # No modification for auto selection
    
    # Add mode-specific enhancements
    mode_instructions = {
        "EVES": "Apply the Eden Verification and Encryption System approach. Focus on accuracy verification, consistency checking, and evidence-based analysis. Eliminate potential hallucinations and provide factual, reliable information.",
        "Large Document Analysis": "Perform comprehensive document analysis with hierarchical summarization. Extract key themes, main arguments, supporting evidence, and provide structured insights across multiple levels of detail.",
        "Coding": "Highlight technical implementations, code examples, algorithms, and best practices. Focus on actionable development insights, performance optimization, and software engineering principles.",
        "Academic Research": "Focus on theoretical concepts, research methodologies, citations, and scholarly analysis with proper academic context. Emphasize peer-reviewed sources and academic rigor.",
        "Finance": "Emphasize financial analysis, market trends, investment insights, risk assessment, and economic implications. Focus on quantitative analysis and financial modeling aspects.",
        "General": "Provide balanced, comprehensive analysis suitable for general audiences. Focus on clarity, accessibility, and practical insights.",
        "Enterprise Model": "Focus on enterprise-level insights, scalability considerations, business process optimization, and strategic decision-making frameworks.",
        "Research": "Focus on key findings, methodologies, and conclusions. Emphasize factual accuracy and cite important data points.",
        "Business": "Emphasize strategic insights, market analysis, financial implications, and actionable business recommendations.",
        "Legal": "Highlight legal precedents, regulatory requirements, compliance issues, and key legal implications.",
        "Medical": "Focus on clinical findings, treatment protocols, medical procedures, and health-related recommendations."
    }
    
    if mode in mode_instructions:
        enhanced_prompt = f"{prompt}\n\nMode-specific focus: {mode_instructions[mode]}"
        return enhanced_prompt
    
    return prompt  # Return original if mode not recognized

@router.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to the LLM Summarizer API"}

@router.get("/health")
async def health_check():
    """Health check endpoint that doesn't require API keys."""
    print("Health check request received")
    return {
        "status": "healthy",
        "message": "Backend is running and accessible via ngrok",
        "timestamp": time.time()
    }

@router.post("/query", response_model=QueryResponse)
async def query_llms(request: QueryRequest):
    """Process a query through all LLM models and return the best response based on similarity."""
    start_time = time.time()
    
    try:
        # Record telemetry for the query
        await telemetry_service.log_query_event(request.query, "multiple", start_time)
        
        # Get responses from all LLMs
        responses = await get_all_llm_responses(request.query)
        
        # Prepare texts for embedding (query + all response values)
        all_texts = [request.query] + list(responses.values())
        
        # Get embeddings for query and all responses
        embeddings = await get_embeddings_batch(all_texts)
        
        # Extract query embedding and response embeddings
        query_embedding = embeddings[0]
        response_embeddings = embeddings[1:]
        
        # Calculate similarities
        similarities = calculate_cosine_similarities(query_embedding, response_embeddings)
        
        # Find best response
        best_index = similarities.index(max(similarities))
        best_model = list(responses.keys())[best_index]
        best_response = responses[best_model]
        best_similarity = similarities[best_index]
        
        end_time = time.time()
        
        # Log performance metrics
        await telemetry_service.log_performance_metrics({
            "processing_time": end_time - start_time,
            "models_queried": len(responses),
            "best_model": best_model,
            "best_similarity": best_similarity
        })
        
        # Create response with similarity scores
        model_similarities = dict(zip(responses.keys(), similarities))
        
        return QueryResponse(
            query=request.query,
            best_response=best_response,
            best_model=best_model,
            similarity_score=best_similarity,
            all_responses=responses,
            similarities=model_similarities,
            processing_time=end_time - start_time
        )
        
    except Exception as e:
        await telemetry_service.log_error_event("query_endpoint", str(e))
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/summarize")
async def summarize_pdf(
    file: UploadFile = File(...),
    prompt: str = Form(...)
):
    """Legacy PDF summarization endpoint - maintained for backward compatibility."""
    start_time = time.time()
    
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read PDF content
        pdf_content = await file.read()
        
        # Log telemetry
        await telemetry_service.log_query_event(prompt, "pdf_summarization", start_time)
        
        # Use the original summarization service for backward compatibility
        result = await summarization_service.summarize_document(pdf_content, prompt)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Log performance
        await telemetry_service.log_performance_metrics({
            "processing_time": processing_time,
            "document_type": "pdf",
            "processing_method": "legacy"
        })
        
        return JSONResponse(content={
            "success": True,
            "result": result,
            "processing_time": processing_time,
            "message": "Document processed using legacy method"
        })
        
    except Exception as e:
        await telemetry_service.log_error_event("pdf_summarization", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hierarchical-summarize")
async def hierarchical_summarize_pdf(
    file: UploadFile = File(...),
    prompt: str = Form(...),
    enable_book_mode: bool = Form(False),
    chapter_detection: bool = Form(False),
    mode: str = Form("Auto Selection")
):
    """
    Enhanced PDF summarization using Hierarchical Multi-LLM Recursive Summarizer.
    
    This endpoint uses the new hierarchical system with:
    - Model-specific semantic chunking
    - Parallel processing within each model pipeline
    - Map-reduce recursive summarization
    - Cosine similarity-based hallucination mitigation
    - Optimized for large documents (books, reports, etc.)
    """
    start_time = time.time()
    
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read PDF content
        pdf_content = await file.read()
        file_size_mb = len(pdf_content) / (1024 * 1024)
        
        # Log telemetry with enhanced metadata
        await telemetry_service.log_query_event(prompt, "hierarchical_pdf_summarization", start_time, {
            "file_size_mb": file_size_mb,
            "filename": file.filename,
            "book_mode_enabled": enable_book_mode,
            "chapter_detection_enabled": chapter_detection,
            "mode": mode
        })
        
        # Customize prompt based on mode
        mode_enhanced_prompt = customize_prompt_for_mode(prompt, mode)
        
        # Process document based on mode
        if enable_book_mode:
            print(f"Processing {file.filename} in book mode with mode: {mode}...")
            result = await enhanced_pdf_service.process_large_book(
                pdf_content, mode_enhanced_prompt, chapter_detection
            )
        else:
            print(f"Processing {file.filename} in standard hierarchical mode with mode: {mode}...")
            result = await enhanced_pdf_service.process_document(pdf_content, mode_enhanced_prompt)
        
        end_time = time.time()
        total_processing_time = end_time - start_time
        
        # Generate detailed report
        detailed_report = enhanced_pdf_service.generate_processing_report(result)
        
        # Log comprehensive performance metrics
        await telemetry_service.log_performance_metrics({
            "processing_time": total_processing_time,
            "document_type": "pdf",
            "processing_method": "hierarchical",
            "file_size_mb": file_size_mb,
            "book_mode": enable_book_mode,
            "best_model": result.hierarchical_summary.best_model,
            "best_similarity": result.hierarchical_summary.best_similarity,
            "models_used": list(result.hierarchical_summary.model_results.keys()),
            "word_count": result.document_metadata.get("word_count", 0),
            "page_count": result.document_metadata.get("page_count", 0),
            "mode": mode
        })
        
        # Debugging: Log the result type to ensure it's not a coroutine
        print(f"Result type: {type(result)}")

        # Ensure the result is not a coroutine
        if asyncio.iscoroutine(result):
            raise HTTPException(status_code=500, detail="Unexpected coroutine result")

        # Ensure hierarchical_summary is accessed correctly
        hierarchical_summary = result.hierarchical_summary
        if not isinstance(hierarchical_summary, HierarchicalSummaryResult):
            raise HTTPException(status_code=500, detail="Invalid hierarchical summary result")

        # Prepare response
        response_data = {
            "success": True,
            "final_summary": hierarchical_summary.final_summary,
            "best_model": hierarchical_summary.best_model,
            "best_similarity_score": hierarchical_summary.best_similarity,
            "processing_metadata": {
                "total_processing_time": total_processing_time,
                "document_analysis": result.document_metadata,
                "processing_stats": result.processing_stats
            },
            "detailed_report": detailed_report,
            "mode": mode
        }
        
        return response_data
        
    except Exception as e:
        await telemetry_service.log_error_event("hierarchical_pdf_summarization", str(e))
        
        # Provide more specific error messages
        error_message = str(e)
        if "API key" in error_message.lower() or "authentication" in error_message.lower():
            error_message = "API key configuration error. Please check your environment variables."
        elif "timeout" in error_message.lower():
            error_message = "Request timed out. The document might be too large. Try with a smaller PDF."
        elif "network" in error_message.lower() or "connection" in error_message.lower():
            error_message = "Network connection error. Please check your internet connection."
        elif "memory" in error_message.lower():
            error_message = "Memory limit exceeded. Please try with a smaller document."
        else:
            error_message = f"Error processing PDF: {str(e)}"
        
        raise HTTPException(status_code=500, detail=error_message)

@router.post("/quick-hierarchical-summarize")
async def quick_hierarchical_summarize(
    text: str = Form(...),
    prompt: str = Form(...)
):
    """
    Quick hierarchical summarization for text input (without PDF processing).
    Useful for testing the hierarchical system with direct text input.
    """
    start_time = time.time()
    
    try:
        # Validate input
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text content cannot be empty")
        
        if len(text) > 2000000:  # 2M characters limit
            raise HTTPException(status_code=400, detail="Text too long. Maximum 2M characters.")
        
        # Log telemetry
        await telemetry_service.log_query_event(prompt, "quick_hierarchical_text", start_time, {
            "text_length": len(text),
            "word_count": len(text.split())
        })
        
        # Process with hierarchical summarizer
        result = await hierarchical_summarizer.summarize_document(text, prompt)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Log performance
        await telemetry_service.log_performance_metrics({
            "processing_time": processing_time,
            "document_type": "text",
            "processing_method": "hierarchical",
            "text_length": len(text),
            "word_count": len(text.split()),
            "best_model": result.best_model,
            "best_similarity": result.best_similarity
        })
        
        # Generate detailed report
        detailed_report = hierarchical_summarizer.get_detailed_report(result)
        
        return JSONResponse(content={
            "success": True,
            "final_summary": result.final_summary,
            "best_model": result.best_model,
            "best_similarity_score": result.best_similarity,
            "processing_time": processing_time,
            "model_results": {
                model: {
                    "summary": res.summary,
                    "final_similarity": res.final_similarity,
                    "chunks_processed": res.chunks_processed,
                    "processing_time": res.processing_time,
                    "error": res.error
                }
                for model, res in result.model_results.items()
            },
            "processing_metadata": result.processing_metadata,
            "detailed_report": detailed_report
        })
        
    except Exception as e:
        await telemetry_service.log_error_event("quick_hierarchical_text", str(e))
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@router.get("/system-status")
async def get_system_status():
    """Get the status of the hierarchical summarization system."""
    try:
        # Test model availability
        model_status = {}
        test_prompt = "Test prompt for system status"
        
        from app.services.llm_service import (
            get_openai_response, get_claude_response, get_gemini_response, 
            get_mistral_response, get_model_context_limits
        )
        
        model_functions = {
            "openai": get_openai_response,
            "claude": get_claude_response,
            "gemini": get_gemini_response,
            "mistral": get_mistral_response
        }
        
        context_limits = get_model_context_limits()
        
        # Quick availability check (without actually calling APIs)
        for model_name in model_functions.keys():
            model_status[model_name] = {
                "available": True,  # Assume available, would need actual API test for real status
                "context_limit": context_limits.get(model_name, 0)
            }
        
        return JSONResponse(content={
            "system_status": "operational",
            "hierarchical_summarizer": "available",
            "semantic_chunker": "available", 
            "model_status": model_status,
            "supported_features": [
                "Multi-model semantic chunking",
                "Parallel chunk processing",
                "Map-reduce recursive summarization",
                "Cosine similarity hallucination detection",
                "Book-length document processing",
                "Model-specific optimization"
            ],
            "max_document_size": "2M tokens (varies by model)",
            "optimal_for": "Large documents, books, comprehensive reports"
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"system_status": "error", "error": str(e)}
        )

@router.post("/chat")
async def chat_with_gpt35(request: QueryRequest):
    """
    Simple chat endpoint using GPT-3.5 Turbo for text-only prompts.
    Used when no file is uploaded - provides fast responses for general queries.
    """
    start_time = time.time()
    
    try:
        # Log telemetry for the chat query
        await telemetry_service.log_query_event(request.prompt, "gpt35_chat", start_time)
        
        # Import the OpenAI function
        from app.services.llm_service import get_openai_response
        
        # Get response from GPT-3.5 Turbo
        model_name, response = await get_openai_response(request.prompt)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Log performance metrics
        await telemetry_service.log_performance_metrics({
            "processing_time": processing_time,
            "model": model_name,
            "query_type": "text_only",
            "response_length": len(response)
        })
        
        return {
            "response": response,
            "model": model_name,
            "processing_time": processing_time,
            "query": request.prompt
        }
        
    except Exception as e:
        await telemetry_service.log_error("gpt35_chat", str(e))
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file for processing. This endpoint validates the file and returns a file ID.
    The actual processing is done by the hierarchical-summarize endpoint.
    """
    try:
        print(f"Upload request received for file: {file.filename}")
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            print(f"Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Validate file size (max 50MB)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        print(f"File size: {file_size} bytes ({file_size / (1024 * 1024):.2f} MB)")
        
        if file_size > 50 * 1024 * 1024:  # 50MB limit
            print(f"File too large: {file_size / (1024 * 1024):.2f} MB")
            raise HTTPException(status_code=413, detail="File size must be less than 50MB")
        
        # Generate a unique file ID (in a real app, you'd store this in a database)
        import uuid
        file_id = str(uuid.uuid4())
        
        print(f"Generated file ID: {file_id}")
        
        # Log the upload
        await telemetry_service.log_query_event(
            f"File upload: {file.filename}", 
            "file_upload", 
            time.time(),
            {
                "filename": file.filename,
                "file_size_mb": file_size / (1024 * 1024),
                "file_id": file_id
            }
        )
        
        response_data = {
            "success": True,
            "file_id": file_id,
            "filename": file.filename,
            "file_size_mb": file_size / (1024 * 1024),
            "message": "File uploaded successfully"
        }
        
        print(f"Upload successful, returning: {response_data}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {str(e)}")
        await telemetry_service.log_error_event("file_upload", str(e))
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/api/telemetry/event")
async def log_frontend_event(event_data: dict):
    """Endpoint for frontend to send telemetry events."""
    try:
        await telemetry.log_event(
            event_type=event_data.get("event_type", "frontend_event"),
            data=event_data.get("data", {})
        )
        return {"status": "logged"}
    except Exception as e:
        await telemetry.log_error("telemetry_logging", str(e))
        raise HTTPException(status_code=500, detail="Failed to log event") 