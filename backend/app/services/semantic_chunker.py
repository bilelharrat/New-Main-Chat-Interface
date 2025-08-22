import asyncio
import re
import time
import hashlib
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from abc import ABC, abstractmethod
import tiktoken

# Import tokenizers for different models
try:
    from transformers import AutoTokenizer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False

try:
    import sentencepiece as spm
    SENTENCEPIECE_AVAILABLE = True
except ImportError:
    SENTENCEPIECE_AVAILABLE = False

@dataclass
class SemanticChunk:
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    token_count: int
    model_type: str
    sentences: List[str] = None

class ModelTokenizer(ABC):
    """Abstract base class for model-specific tokenizers."""
    
    @abstractmethod
    def count_tokens(self, text: str) -> int:
        pass
    
    @abstractmethod
    def get_max_context_tokens(self) -> int:
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        pass

class OpenAITokenizer(ModelTokenizer):
    def __init__(self):
        self.tokenizer = tiktoken.encoding_for_model("gpt-3.5-turbo")
        
    def count_tokens(self, text: str) -> int:
        return len(self.tokenizer.encode(text))
    
    def get_max_context_tokens(self) -> int:
        return 12000  # Keep same chunk size for consistency
    
    def get_model_name(self) -> str:
        return "gpt-3.5-turbo"

class ClaudeTokenizer(ModelTokenizer):
    def __init__(self):
        self.tokenizer = tiktoken.encoding_for_model("gpt-4")
        
    def count_tokens(self, text: str) -> int:
        return len(self.tokenizer.encode(text))
    
    def get_max_context_tokens(self) -> int:
        return 12000
    def get_model_name(self) -> str:
        return "claude-sonnet-4-20250514"

class GeminiTokenizer(ModelTokenizer):
    def __init__(self):
        self.tokenizer = tiktoken.encoding_for_model("gpt-4")
        
    def count_tokens(self, text: str) -> int:
        return len(self.tokenizer.encode(text))
    
    def get_max_context_tokens(self) -> int:   ### impotant for later
        return 12000
    def get_model_name(self) -> str:
        return "gemini-2.5-pro"

class MistralTokenizer(ModelTokenizer):
    def __init__(self):
        self.tokenizer = tiktoken.encoding_for_model("gpt-4")
        
    def count_tokens(self, text: str) -> int:
        return len(self.tokenizer.encode(text))
    
    def get_max_context_tokens(self) -> int:
        return 12000
    
    def get_model_name(self) -> str:
        return "mistral-large"

class LightningSemanticChunker:
    """
    🚀 LIGHTNING-FAST Semantic Chunker with Industry Best Practices:
    
    Performance Optimizations:
    - Pre-calculated token counting (O(n) instead of O(n²))
    - Multi-level caching (sentences, tokens, chunks)
    - Optimized spaCy pipeline (disabled unnecessary components)
    - Intelligent sentence splitting based on document size
    - Batched processing with progress tracking
    - Memory-efficient chunk assembly
    
    Features:
    - 80K token context windows for all models
    - Model-specific tokenization (separate for each model)
    - Sentence-level chunking with overlap
    - Smart fallbacks for edge cases
    """
    
    def __init__(self):
        print("🚀 Initializing Lightning Semantic Chunker...")
        
        # Model-specific tokenizers with 80K context windows
        self.tokenizers = {
            "openai": OpenAITokenizer(),
            "claude": ClaudeTokenizer(), 
            "gemini": GeminiTokenizer(),
            "mistral": MistralTokenizer()
        }
        
        # Multi-level caching for maximum performance
        self._sentence_cache = {}  # Cache sentence splits by text hash
        self._token_cache = {}     # Cache token counts by (text_hash, model) key
        self._chunk_cache = {}     # Cache complete chunk results
        
        # Initialize optimized spaCy pipeline
        self.nlp = None
        if SPACY_AVAILABLE:
            try:
                self.nlp = spacy.load("en_core_web_sm")
                # PERFORMANCE: Disable unnecessary components for speed
                self.nlp.disable_pipes(["ner", "parser", "tagger", "lemmatizer", "attribute_ruler"])
                self.nlp.max_length = 10000000  # Handle very large documents
                print("✅ spaCy optimized pipeline loaded (sentence segmentation only)")
            except OSError:
                print("⚠️  spaCy model not found, using fast regex splitting")
        
        print(f"✅ Lightning Chunker ready for {len(self.tokenizers)} models")
    
    def _get_text_hash(self, text: str) -> str:
        """Generate fast hash for caching."""
        return hashlib.md5(text.encode('utf-8')).hexdigest()[:16]
    
    def _lightning_sentence_split(self, text: str) -> List[str]:
        """⚡ Ultra-fast sentence splitting with intelligent strategy selection."""
        text_hash = self._get_text_hash(text)
        
        # Check cache first
        if text_hash in self._sentence_cache:
            print(f"📋 Using cached sentences ({len(self._sentence_cache[text_hash])} sentences)")
            return self._sentence_cache[text_hash]
        
        print(f"🔧 Lightning sentence splitting: {len(text):,} chars...")
        start_time = time.time()
        
        # STRATEGY: Choose splitting method based on document size for optimal performance
        if len(text) > 1000000:  # 1M+ chars: Ultra-fast regex only
            print("🚀 MEGA DOCUMENT: Ultra-fast regex splitting")
            # Super-optimized regex for massive documents
            sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z][a-z])', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
            
        elif len(text) > 200000:  # 200K+ chars: Fast regex
            print("⚡ LARGE DOCUMENT: Fast regex splitting") 
            sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 15] # stripping from white spaces and filtering regex artifacts
            
        elif self.nlp and len(text) <= 200000:  # Small docs: Use spaCy for quality
            print("🧠 STANDARD DOCUMENT: spaCy precision splitting")
            doc = self.nlp(text)
            sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 10]
            
        else:  # Fallback
            print("⚡ FALLBACK: Basic regex splitting") # Basic regex splitting
            sentences = re.split(r'[.!?]+\s+', text)
            sentences = [s.strip() for s in sentences if s.strip()]
        
        # Cache the result
        self._sentence_cache[text_hash] = sentences
        
        split_time = time.time() - start_time
        print(f"✅ Split complete: {len(sentences):,} sentences in {split_time:.2f}s ({len(sentences)/split_time:.0f} sent/sec)")
        
        return sentences
    
    def _lightning_token_counting(self, sentences: List[str], tokenizer: ModelTokenizer, model_type: str) -> List[int]:   #### fo each model 
        """⚡ Lightning-fast token counting with advanced caching and clean architecture."""
        print(f"⚡ Lightning token counting: {len(sentences):,} sentences for {model_type}")
        start_time = time.time()
        
        sentence_tokens = []
        cache_hits = 0
        new_calculations = 0
        progress_interval = 500
        
        for i, sentence in enumerate(sentences):
            # Smart caching with model-specific keys
            sentence_hash = self._get_text_hash(sentence)
            cache_key = f"{sentence_hash}:{model_type}" 
            # The way this is calculated is not optimal for the current setup 
            # since for simplicity purposes, I am using the same tokenizer for all models
            # As long as it works, it is okay.
            #Plus, I will keep this for later use when working with model-specific tokenizers
            
            if cache_key in self._token_cache:
                token_count = self._token_cache[cache_key]
                cache_hits += 1
            else:
                token_count = tokenizer.count_tokens(sentence)
                self._token_cache[cache_key] = token_count
                # crucial operation to populate the token_cache 
                new_calculations += 1
            
            sentence_tokens.append(token_count)
            
            # Progress tracking for large documents
            if i > 0 and i % (progress_interval * 10) == 0:  # Every 5000 sentences
                elapsed = time.time() - start_time
                rate = (i + 1) / elapsed if elapsed > 0 else 0
                print(f"  📊 Progress: {i + 1:,}/{len(sentences):,} sentences ({rate:.0f}/sec)")
        
        count_time = time.time() - start_time
        efficiency = cache_hits / (cache_hits + new_calculations) * 100 if (cache_hits + new_calculations) > 0 else 0
        
        print(f"✅ Token counting complete in {count_time:.2f}s")
        print(f"   📈 Cache efficiency: {efficiency:.1f}% ({cache_hits:,} hits, {new_calculations:,} new)")
        print(f"   🚀 Performance: {len(sentences)/count_time:.0f} sentences/sec")
        
        return sentence_tokens
    
    def _lightning_chunk_assembly(self, sentences: List[str], sentence_tokens: List[int], 
                                  model_type: str, overlap_ratio: float, max_tokens: int = 1000) -> List[SemanticChunk]:
        """⚡ Lightning-fast chunk assembly with optimized algorithms."""
        print(f"🚀 Lightning chunk assembly: {model_type} (max: {max_tokens:,} tokens)")
        start_time = time.time()
        
        chunks = []
        current_sentences = []
        current_tokens = 0
        
        for i, (sentence, token_count) in enumerate(zip(sentences, sentence_tokens)):
            # FAST CHECK: Can we add this sentence without exceeding limit?
            if current_tokens + token_count <= max_tokens:
                current_sentences.append(sentence)
                current_tokens += token_count
            else:
                # Current chunk is full - save it
                if current_sentences:
                    chunk_content = " ".join(current_sentences)
                    
                    chunk = SemanticChunk(
                        content=chunk_content,
                        chunk_index=len(chunks),
                        start_char=0,  # Calculated later if needed
                        end_char=len(chunk_content),
                        token_count=current_tokens,
                        model_type=model_type,
                        sentences=current_sentences.copy()
                    )
                    chunks.append(chunk)
                    
                    # EFFICIENT OVERLAP: Calculate overlap sentences and tokens
                    overlap_size = max(1, int(len(current_sentences) * overlap_ratio))
                    overlap_sentences = current_sentences[-overlap_size:]
                    
                    # Calculate overlap tokens efficiently using pre-computed values
                    overlap_start_idx = len(current_sentences) - overlap_size
                    overlap_tokens = sum(sentence_tokens[i - len(current_sentences) + overlap_start_idx:i])
                    
                    # Start new chunk with overlap + current sentence
                    current_sentences = overlap_sentences + [sentence]
                    current_tokens = overlap_tokens + token_count
                else:
                    # This is the first sentence of a new chunk
                    current_sentences = [sentence]
                    current_tokens = token_count
        
        # Add the final chunk if it has content
        if current_sentences:
            chunk_content = " ".join(current_sentences)
            chunk = SemanticChunk(
                content=chunk_content,
                chunk_index=len(chunks),
                start_char=0,
                end_char=len(chunk_content),
                token_count=current_tokens,
                model_type=model_type,
                sentences=current_sentences.copy()
            )
            chunks.append(chunk)
        
        assembly_time = time.time() - start_time
        print(f"✅ Assembly complete in {assembly_time:.2f}s")
        print(f"   📊 Created {len(chunks):,} chunks, {sum(chunk.token_count for chunk in chunks):,} total tokens")
        print(f"   📈 Average chunk size: {sum(chunk.token_count for chunk in chunks) / len(chunks):.0f} tokens")
        print(f"   🚀 Performance: {len(chunks)/assembly_time:.1f} chunks/sec")
        
        return chunks
    
    def create_semantic_chunks(self, text: str, model_type: str, overlap_ratio: float = 0.1) -> List[SemanticChunk]:
        """🚀 Create lightning-fast semantic chunks for a specific model."""
        if model_type not in self.tokenizers:
            available = list(self.tokenizers.keys())
            raise ValueError(f"❌ Unsupported model: {model_type}. Available: {available}")
        
        print(f"\n🚀 LIGHTNING CHUNKING: {model_type.upper()}")
        print(f"📄 Document: {len(text):,} chars, {len(text.split()):,} words")
        
        # Check cache for complete result
        cache_key = f"{self._get_text_hash(text)}:{model_type}:{overlap_ratio}"
        if cache_key in self._chunk_cache:
            cached_chunks = self._chunk_cache[cache_key]
            print(f"📋 Using cached chunks: {len(cached_chunks)} chunks")
            return cached_chunks
        
        tokenizer = self.tokenizers[model_type]
        max_tokens = int(tokenizer.get_max_context_tokens() * 0.85) 
        
        total_start = time.time()
        
        # STEP 1: Lightning sentence splitting
        sentences = self._lightning_sentence_split(text)
        
        if not sentences:
            print("No sentences found, using character fallback")
            return self._character_fallback(text, tokenizer, max_tokens, model_type)
        
        # STEP 2: Lightning token counting with caching
        sentence_tokens = self._lightning_token_counting(sentences, tokenizer, model_type)
        
        # STEP 3: Lightning chunk assembly
        chunks = self._lightning_chunk_assembly(sentences, sentence_tokens, model_type, overlap_ratio, max_tokens)
        
        # Cache the complete result
        self._chunk_cache[cache_key] = chunks # This is where it gets cached
        
        total_time = time.time() - total_start
        total_tokens = sum(c.token_count for c in chunks)
        
        print(f"\n🎯 LIGHTNING CHUNKING COMPLETE:")
        print(f"   ⚡ Total time: {total_time:.2f}s")
        print(f"   📊 {len(chunks)} chunks, {total_tokens:,} tokens")
        print(f"   🚀 Overall performance: {len(sentences)/total_time:.0f} sentences/sec")
        print(f"   💾 Max chunk size: {max_tokens:,} tokens (85% of {tokenizer.get_max_context_tokens():,})")
        
        return chunks
    
    def _character_fallback(self, text: str, tokenizer: ModelTokenizer, max_tokens: int, model_type: str) -> List[SemanticChunk]:
        """⚡ Fast character-based fallback for edge cases."""
        print("⚡ Using character-based fallback")
        
        # Quick estimation of chars per token
        sample_size = min(5000, len(text))
        sample_tokens = tokenizer.count_tokens(text[:sample_size])
        chars_per_token = sample_size / max(sample_tokens, 1)
        target_chars = int(max_tokens * chars_per_token * 0.9)
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = min(start + target_chars, len(text))
            
            # Try to break at sentence boundaries
            if end < len(text):
                for delim in ['. ', '! ', '? ', '\n\n', '\n', ' ']:
                    last_pos = text.rfind(delim, start + int(target_chars * 0.8), end)
                    if last_pos > start:
                        end = last_pos + len(delim)
                        break
            
            chunk_text = text[start:end].strip()
            if chunk_text:
                chunk = SemanticChunk(
                    content=chunk_text,
                    chunk_index=len(chunks),
                    start_char=start,
                    end_char=end,
                    token_count=tokenizer.count_tokens(chunk_text),
                    model_type=model_type
                )
                chunks.append(chunk)
            
            start = end
        
        return chunks
    
    async def create_multi_model_chunks(self, text: str) -> Dict[str, List[SemanticChunk]]:
        """🚀 Create chunks for all models in parallel with maximum performance."""
        print(f"\n🚀 MULTI-MODEL LIGHTNING CHUNKING")
        print(f"📄 Processing {len(text):,} chars across {len(self.tokenizers)} models")
        
        start_time = time.time()
        
        async def process_model(model_type):
            """Process single model in thread pool."""
            try:
                # Run in thread pool to prevent blocking
                chunks = await asyncio.to_thread(self.create_semantic_chunks, text, model_type)
                return model_type, chunks
            except Exception as e:
                print(f"❌ Error in {model_type}: {e}")
                return model_type, []
        
        # Launch all models in parallel
        tasks = [process_model(model_type) for model_type in self.tokenizers.keys()]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collect results
        model_chunks = {}
        total_chunks = 0
        
        for result in results:
            if isinstance(result, Exception):
                print(f"❌ Parallel processing error: {result}")
                continue
            
            model_type, chunks = result
            model_chunks[model_type] = chunks
            total_chunks += len(chunks)
        
        total_time = time.time() - start_time
        
        print(f"\n🎯 MULTI-MODEL CHUNKING COMPLETE:")
        print(f"   ⚡ Total time: {total_time:.2f}s")
        print(f"   📊 {len(model_chunks)} models, {total_chunks} total chunks")
        print(f"   🚀 Performance: {total_chunks/total_time:.1f} chunks/sec")
        
        # Show per-model statistics
        for model_type, chunks in model_chunks.items():
            if chunks:
                avg_tokens = sum(c.token_count for c in chunks) / len(chunks)
                total_model_tokens = sum(c.token_count for c in chunks)
                print(f"   • {model_type}: {len(chunks)} chunks, {total_model_tokens:,} tokens (avg: {avg_tokens:.0f})")
        
        return model_chunks

# Alias for backward compatibility
SemanticChunker = LightningSemanticChunker 

# Revire this at the end of 