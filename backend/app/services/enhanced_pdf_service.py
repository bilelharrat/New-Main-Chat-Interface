import io
from typing import List, Dict, Any, Optional
from pathlib import Path
import PyPDF2
from dataclasses import dataclass

# Import existing PDF extraction capabilities
from app.services.pdf_service import PDFService
from app.services.hierarchical_summarizer import HierarchicalSummarizer, HierarchicalSummaryResult

@dataclass
class BookProcessingResult:
    """Result of processing a large document/book."""
    hierarchical_summary: HierarchicalSummaryResult
    document_metadata: Dict[str, Any]
    processing_stats: Dict[str, Any]

class EnhancedPDFService:
    """
    Enhanced PDF service that integrates with the hierarchical multi-LLM summarizer.
    Designed to handle large documents like entire books (1000+ pages).
    """
    
    def __init__(self):
        self.base_pdf_service = PDFService()
        self.hierarchical_summarizer = HierarchicalSummarizer()
        
        # Configuration for large document processing
        self.max_pages_warning = 100
        self.max_words_warning = 100000
    
    def _analyze_document_complexity(self, text: str, pdf_content: bytes) -> Dict[str, Any]:
        """Analyze the complexity and characteristics of the document."""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
            page_count = len(pdf_reader.pages)
        except:
            page_count = 0
        
        word_count = len(text.split())
        char_count = len(text)
        
        # Estimate reading time (average 200 words per minute)
        estimated_reading_time = word_count / 200
        
        # Analyze text characteristics
        lines = text.split('\n')
        avg_line_length = sum(len(line) for line in lines) / max(len(lines), 1)
        
        # Detect document type based on patterns
        doc_type = "unknown"
        if page_count > 200 and word_count > 50000:
            doc_type = "book"
        elif page_count > 50:
            doc_type = "long_document"
        elif word_count > 10000:
            doc_type = "article"
        else:
            doc_type = "short_document"
        
        complexity_score = 0
        if page_count > 100:
            complexity_score += 2
        if word_count > 50000:
            complexity_score += 2
        if avg_line_length > 100:
            complexity_score += 1
        
        return {
            "page_count": page_count,
            "word_count": word_count,
            "character_count": char_count,
            "estimated_reading_time_minutes": estimated_reading_time,
            "average_line_length": avg_line_length,
            "document_type": doc_type,
            "complexity_score": complexity_score,
            "processing_recommendations": self._get_processing_recommendations(page_count, word_count, complexity_score)
        }
    
    def _get_processing_recommendations(self, page_count: int, word_count: int, complexity_score: int) -> List[str]:
        """Generate processing recommendations based on document analysis."""
        recommendations = []
        
        if page_count > self.max_pages_warning:
            recommendations.append(f"Large document detected ({page_count} pages). Processing may take several minutes.")
        
        if word_count > self.max_words_warning:
            recommendations.append(f"High word count ({word_count} words). Consider more specific prompts for better results.")
        
        if complexity_score >= 4:
            recommendations.append("Complex document detected. The system will use hierarchical processing for optimal results.")
        
        if page_count > 500:
            recommendations.append("Book-length document. The system will employ multi-stage recursive summarization.")
        
        return recommendations
    
    def _prepare_processing_context(self, user_prompt: str, metadata: Dict[str, Any]) -> str:
        """Enhance the user prompt with document context."""
        doc_type = metadata.get("document_type", "document")
        word_count = metadata.get("word_count", 0)
        
        context_enhanced_prompt = user_prompt
        
        if doc_type == "book" and word_count > 100000:
            context_enhanced_prompt += f"\n\nNote: This is a book-length document ({word_count} words). Please provide a comprehensive summary that captures the main themes, key arguments, and important details across all sections."
        elif doc_type == "long_document":
            context_enhanced_prompt += f"\n\nNote: This is a substantial document ({word_count} words). Please ensure your summary covers all major sections and key points."
        
        return context_enhanced_prompt
    
    async def process_document(self, pdf_content: bytes, user_prompt: str) -> BookProcessingResult:
        import time
        start_time = time.time()
        print("Extracting text from PDF...")
        try:
            text = self.base_pdf_service.extract_text_from_pdf(pdf_content)
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
        
        if not text.strip():
            raise Exception("No text content found in the PDF")
        
        print(f"Extracted {len(text)} characters")
        
        # Analyze document complexity
        print("Analyzing document complexity...")
        metadata = self._analyze_document_complexity(text, pdf_content)
        
        print(f"Document analysis: {metadata['document_type']} with {metadata['word_count']} words")
        
        # Show processing recommendations
        for rec in metadata["processing_recommendations"]:
            print(f"Recommendation: {rec}")
        
        # Enhance prompt with context
        enhanced_prompt = self._prepare_processing_context(user_prompt, metadata)
        
        # Process with hierarchical summarizer
        print("Starting hierarchical multi-LLM processing...")
        hierarchical_result = await self.hierarchical_summarizer.summarize_document(text, enhanced_prompt)
        processing_time = time.time() - start_time
        processing_stats = {
            "total_processing_time": processing_time,
            "text_extraction_successful": True,
            "models_attempted": list(hierarchical_result.model_results.keys()),
            "best_performing_model": hierarchical_result.best_model,
            "overall_confidence": hierarchical_result.best_similarity,
            "processing_efficiency": metadata["word_count"] / max(processing_time, 0.001)
        }
        return BookProcessingResult(
            hierarchical_summary=hierarchical_result,
            document_metadata=metadata,
            processing_stats=processing_stats
        )
    
    async def process_large_book(self, pdf_content: bytes, user_prompt: str, chapter_detection: bool = True) -> BookProcessingResult:
        result = await self.process_document(pdf_content, user_prompt)
        if result.document_metadata.get("document_type") == "book":
            result.document_metadata["book_processing_notes"] = [
                "Document processed as a book using hierarchical summarization",
                "Each model processed optimized chunks based on its context window",
                "Recursive summarization applied for comprehensive coverage",
                f"Best results achieved with {result.hierarchical_summary.best_model} model"
            ]
            if chapter_detection:
                result.document_metadata["chapter_detection"] = {
                    "attempted": True,
                    "chapters_found": 0,
                    "note": "Chapter detection will be implemented in future versions"
                }
        return result
    
    def generate_processing_report(self, result: BookProcessingResult) -> Dict[str, Any]:
        """Generate a comprehensive report of the document processing."""
        # Get detailed report from hierarchical summarizer
        detailed_report = self.hierarchical_summarizer.get_detailed_report(result.hierarchical_summary)
        
        # Add document-specific information
        report = {
            **detailed_report,
            "document_analysis": result.document_metadata,
            "processing_statistics": result.processing_stats,
            "quality_assessment": {
                "text_extraction_quality": "high" if result.processing_stats["text_extraction_successful"] else "low",
                "summary_confidence": "high" if result.hierarchical_summary.best_similarity > 0.7 else 
                                    "medium" if result.hierarchical_summary.best_similarity > 0.5 else "low",
                "processing_efficiency": "fast" if result.processing_stats["processing_efficiency"] > 100 else
                                       "normal" if result.processing_stats["processing_efficiency"] > 50 else "slow"
            }
        }
        
        # Add specific recommendations for large documents
        if result.document_metadata.get("word_count", 0) > 100000:
            report["recommendations"].extend([
                "Consider processing specific sections separately for more detailed analysis",
                "For academic use, consider generating section-wise summaries",
                "The hierarchical approach ensures comprehensive coverage of the entire document"
            ])
        
        return report 