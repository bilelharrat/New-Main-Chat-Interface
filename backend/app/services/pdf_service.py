import io
from typing import List, Dict, Any
from pathlib import Path
import PyPDF2
import tiktoken
from dataclasses import dataclass
import re

# Try to import pdfplumber as alternative
try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

# Try to import OCR libraries
try:
    import pytesseract
    from pdf2image import convert_from_bytes
    OCR_AVAILABLE = True
    
    # Configure Tesseract path for Windows
    import platform
    if platform.system() == "Windows":
        # Common Windows installation paths
        possible_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Users\AppData\Local\Tesseract-OCR\tesseract.exe",
            r"C:\Tesseract-OCR\tesseract.exe"
        ]
        
        for path in possible_paths:
            import os
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"Tesseract found at: {path}")
                break
        else:
            print("Warning: Tesseract not found in common locations")
            
except ImportError:
    OCR_AVAILABLE = False

@dataclass
class DocumentChunk:
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    token_count: int

class PDFService:
    def __init__(self):
        # Model context limits (leaving room for prompt and response)
        self.model_limits = {
            "openai": 8000,      # GPT-4 has 128k, but we'll be conservative
            "claude": 100000,    # Claude-3 has 200k
            "gemini": 30000,     # Gemini 2.0 has 2M, but we'll be conservative  
            "mistral": 8000      # Mistral Large has 128k
        }
        self.tokenizer = tiktoken.get_encoding("cl100k_base")  # GPT-4 tokenizer
    
    def extract_text_with_ocr(self, pdf_content: bytes) -> str:
        """Extract text using OCR for image-based or problematic PDFs."""
        if not OCR_AVAILABLE:
            raise Exception("OCR libraries not available. Install: pip install pytesseract pdf2image")
            
        try:
            print("Attempting OCR extraction...")
            
            # Convert PDF pages to images
            images = convert_from_bytes(pdf_content, dpi=300)
            print(f"OCR: Converted PDF to {len(images)} images")
            
            text = ""
            for page_num, image in enumerate(images):
                print(f"OCR: Processing page {page_num + 1}...")
                
                # Extract text from image using OCR
                page_text = pytesseract.image_to_string(image, lang='eng')
                print(f"OCR Page {page_num + 1}: {len(page_text)} characters")
                print(f"OCR First 200 chars: {page_text[:200]}")
                
                text += page_text + "\n"
            
            print(f"OCR total text: {len(text)} characters")
            return text.strip()
            
        except Exception as e:
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def extract_text_with_pdfplumber(self, pdf_content: bytes) -> str:
        """Alternative PDF extraction using pdfplumber."""
        if not PDFPLUMBER_AVAILABLE:
            raise Exception("pdfplumber not available")
            
        try:
            text = ""
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                print(f"PDFPlumber: PDF has {len(pdf.pages)} pages")
                
                for page_num, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    print(f"PDFPlumber Page {page_num + 1}: {len(page_text)} characters")
                    print(f"PDFPlumber First 200 chars: {page_text[:200]}")
                    text += page_text + "\n"
                    
            print(f"PDFPlumber total text: {len(text)} characters")
            return text.strip()
        except Exception as e:
            raise Exception(f"Error with pdfplumber: {str(e)}")
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:   # Main function with fallback mechnaism for problematic PDF's/Texts
        """Extract text content from PDF bytes with multiple fallback methods."""
        
        # Method 1: Try PyPDF2 first
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
            text = ""
            
            print(f"PyPDF2: PDF has {len(pdf_reader.pages)} pages")
            
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                print(f"PyPDF2 Page {page_num + 1}: {len(page_text)} characters")
                print(f"PyPDF2 First 200 chars: {page_text[:200]}")
                text += page_text + "\n"
            
            print(f"PyPDF2 total text: {len(text)} characters")
            
            # Check if extraction seems valid
            if len(text.strip()) > 50 and not self._is_problematic_text(text):
                print("PyPDF2 extraction successful!")
                return text.strip()
            else:
                print("PyPDF2 extraction has issues, trying alternatives...")
                
        except Exception as e:
            print(f"PyPDF2 failed: {str(e)}")
        
        # Method 2: Try pdfplumber if available
        if PDFPLUMBER_AVAILABLE:
            try:
                text = self.extract_text_with_pdfplumber(pdf_content)
                if len(text.strip()) > 50 and not self._is_problematic_text(text):
                    print("PDFPlumber extraction successful!")
                    return text
                else:
                    print("PDFPlumber also has issues, trying OCR...")
            except Exception as e:
                print(f"pdfplumber failed: {str(e)}")
        
        # Method 3: Try OCR as last resort
        if OCR_AVAILABLE:
            try:
                text = self.extract_text_with_ocr(pdf_content)
                if len(text.strip()) > 50:
                    print("OCR extraction successful!")
                    return text
            except Exception as e:
                print(f"OCR failed: {str(e)}")
        
        # If all methods fail, return error with suggestions
        error_msg = """
Could not extract readable text from PDF. Possible issues:
1. PDF contains scanned images (need OCR: pip install pytesseract pdf2image)
2. PDF is encrypted or password protected
3. PDF has complex formatting or font issues
4. PDF contains CID encoding problems

Try:
- Converting PDF to a different format
- Using a different PDF file
- Installing OCR dependencies: pip install pytesseract pdf2image
"""
        raise Exception(error_msg.strip())
    
    def _is_problematic_text(self, text: str) -> bool:
        """Check if text has common extraction problems."""
        
        # Check for CID encoding issues
        cid_pattern = r'\(cid:\d+\)'
        cid_matches = len(re.findall(cid_pattern, text))
        
        # Check for slash-separated numbers
        slash_count = text.count('/')
        digit_count = sum(c.isdigit() for c in text)
        letter_count = sum(c.isalpha() for c in text)
        
        total_chars = len(text.replace(' ', '').replace('\n', ''))
        
        if total_chars == 0:
            return True
            
        # If more than 30% is CID codes, it's problematic
        if cid_matches > 0:
            cid_ratio = (cid_matches * 10) / total_chars  # Each CID is ~10 chars
            if cid_ratio > 0.3:
                print(f"Detected CID encoding issues: {cid_matches} CID codes")
                return True
        
        # If more than 70% is slashes and digits, likely encoded
        encoded_ratio = (slash_count + digit_count) / total_chars
        if encoded_ratio > 0.7:
            print(f"Detected encoded text: {encoded_ratio:.2%} numbers/slashes")
            return True
        
        # If very few letters compared to other characters, problematic
        if letter_count / total_chars < 0.3:
            print(f"Too few letters: {letter_count/total_chars:.2%} letters")
            return True
            
        return False
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text using GPT-4 tokenizer."""
        return len(self.tokenizer.encode(text))
    
    def chunk_text(self, text: str, max_tokens: int = 6000, overlap_tokens: int = 200) -> List[DocumentChunk]:
        """
        Chunk text into overlapping segments based on token count.
        
        Args:
            text: The text to chunk
            max_tokens: Maximum tokens per chunk
            overlap_tokens: Number of overlapping tokens between chunks
        """
        tokens = self.tokenizer.encode(text)
        chunks = []
        
        if len(tokens) <= max_tokens:
            # Document is small enough to fit in one chunk
            return [DocumentChunk(
                content=text,
                chunk_index=0,
                start_char=0,
                end_char=len(text),
                token_count=len(tokens)
            )]
        
        start_idx = 0
        chunk_index = 0
        
        while start_idx < len(tokens):
            # Calculate end index for this chunk
            end_idx = min(start_idx + max_tokens, len(tokens))
            
            # Extract tokens for this chunk
            chunk_tokens = tokens[start_idx:end_idx]
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            # Find character positions (approximate)
            start_char = len(self.tokenizer.decode(tokens[:start_idx])) if start_idx > 0 else 0
            end_char = len(self.tokenizer.decode(tokens[:end_idx]))
            
            chunks.append(DocumentChunk(
                content=chunk_text,
                chunk_index=chunk_index,
                start_char=start_char,
                end_char=end_char,
                token_count=len(chunk_tokens)
            ))
            
            # Move start index forward, accounting for overlap
            start_idx = end_idx - overlap_tokens
            chunk_index += 1
            
            # Break if we've reached the end
            if end_idx >= len(tokens):
                break
        
        return chunks
    
    def get_optimal_chunk_size(self, model: str, prompt_length: int) -> int:
        """Get optimal chunk size for a specific model, accounting for prompt and response space."""
        base_limit = self.model_limits.get(model, 4000)
        # Reserve space for prompt, summary response, and safety margin
        available_tokens = base_limit - prompt_length - 2000  # 2000 for response + margin
        return max(1000, available_tokens)  # Minimum 1000 tokens per chunk
    
    def prepare_document_for_summarization(self, pdf_content: bytes, prompt: str) -> Dict[str, Any]:
        """
        Prepare a PDF document for summarization by extracting text and chunking appropriately.
        
        Returns:
            - full_text: Complete extracted text
            - chunks: List of document chunks
            - metadata: Document metadata (token count, chunk info, etc.)
        """
        # Extract text from PDF
        full_text = self.extract_text_from_pdf(pdf_content)
        total_tokens = self.count_tokens(full_text)
        prompt_tokens = self.count_tokens(prompt)
        
        # Determine if we need chunking
        needs_chunking = total_tokens > 6000  # Conservative threshold
        
        if needs_chunking:
            # Chunk the document
            chunks = self.chunk_text(full_text, max_tokens=6000, overlap_tokens=200)
        else:
            # Small document, use as single chunk
            chunks = [DocumentChunk(
                content=full_text,
                chunk_index=0,
                start_char=0,
                end_char=len(full_text),
                token_count=total_tokens
            )]
        
        return {
            "full_text": full_text,
            "chunks": chunks,
            "metadata": {
                "total_tokens": total_tokens,
                "prompt_tokens": prompt_tokens,
                "num_chunks": len(chunks),
                "needs_chunking": needs_chunking,
                "avg_chunk_tokens": sum(chunk.token_count for chunk in chunks) / len(chunks)
            }
        } 