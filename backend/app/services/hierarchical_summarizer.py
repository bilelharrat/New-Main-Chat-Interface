import asyncio # concurency
import numpy as np
import time
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass, asdict # clean way to definbe data holding classes
from concurrent.futures import ThreadPoolExecutor # parallelism
from sklearn.metrics.pairwise import cosine_similarity
import re # For markdown post-processing

from app.services.semantic_chunker import LightningSemanticChunker, SemanticChunk
from app.services.embedding_service import get_embedding, get_embeddings_batch
from app.services.llm_service import (
    get_openai_response, get_claude_response, 
    get_gemini_response, get_mistral_response
)
# from app.services.factuality_checker import FactualityChecker, FactualityResult  # DISABLED

@dataclass
class ModelSummaryResult:
    model_name: str
    summary: str
    chunks_processed: int
    final_similarity: float  # Similarity between final summary and last-stage input
    processing_time: float
    intermediate_summaries: List[str]  # Store intermediate summaries for similarity calculation
    # factuality_results: Optional[List[FactualityResult]] = None  # DISABLED - Factuality checking results for chunk summaries
    # overall_factuality_score: Optional[float] = None  # DISABLED - Average factuality confidence across all chunks
    error: Optional[str] = None

@dataclass
class HierarchicalSummaryResult:
    final_summary: str
    best_model: str
    best_similarity: float
    model_results: Dict[str, ModelSummaryResult]
    processing_metadata: Dict[str, Any]

class OptimizedHierarchicalSummarizer:
    """
    🚀 OPTIMIZED Hierarchical Multi-LLM Summarizer with Fixed Requirements:
    
    Key Features:
    - Max output: 3500-4000 tokens per summary
    - Cosine similarity between final summary and last-stage input text
    - Efficient merge_summaries_recursive implementation
    - Lightning-fast parallel processing
    
    Process:
    1. Lightning semantic chunking (10 tokens per chunk)
    2. Parallel chunk summarization with aggressive compression
    3. Recursive merging with token limits
    4. Final similarity calculation (summary vs last-stage input)
    5. Model selection based on best similarity scores
    """
    
    def __init__(self):
        print("🚀 Initializing Optimized Hierarchical Summarizer...")
        
        # Performance settings - optimized for speed
        self.max_chunks_per_merge = 12  # Maximum chunks per merge for speed
        self.max_output_tokens = 3500
        self.compression_ratio = 0.2  # Ultra-aggressive compression
        
        # Model functions mapping
        self.model_functions = {
            "openai": get_openai_response,
            "claude": get_claude_response,
            "gemini": get_gemini_response,
            "mistral": get_mistral_response
        }
        
        # Initialize semantic chunker (factuality checker disabled)
        self.semantic_chunker = LightningSemanticChunker()
        # self.factuality_checker = FactualityChecker()  # DISABLED
        
        print(f"✅ Optimized Summarizer ready: max {self.max_output_tokens} tokens output")
        print(f"   📊 {len(self.model_functions)} models available")
        print(f"   🚫 Factuality checking DISABLED for faster processing")
    
    def _log_error(self, context: str, error: Exception):
        """Log errors with context for better debugging."""
        print(f"❌ Error in {context}: {str(error)}")

    def _format_markdown_summary(self, summary: str) -> str:
        """Post-process summary to ensure clean markdown formatting."""
        # Remove excessive line breaks (3+ consecutive newlines)
        summary = re.sub(r'\n\s*\n\s*\n+', '\n\n', summary)
        
        # Fix spacing around headers
        summary = re.sub(r'\n\s*#', '\n\n#', summary)  # Add space before headers
        summary = re.sub(r'(#+[^\n]+)\n([^\n#])', r'\1\n\n\2', summary)  # Add space after headers
        
        # Fix list formatting
        summary = re.sub(r'\n\s*-\s*', '\n- ', summary)  # Clean bullet points
        summary = re.sub(r'\n\s*(\d+)\.\s*', r'\n\1. ', summary)  # Clean numbered lists
        
        # Ensure proper paragraph spacing
        summary = re.sub(r'([.!?])\s*\n([A-Z])', r'\1\n\n\2', summary)  # Add space between sentences
        
        # Clean up bold/italic formatting
        summary = re.sub(r'\*\*\s+', '**', summary)  # Remove space after opening bold
        summary = re.sub(r'\s+\*\*', '**', summary)  # Remove space before closing bold
        summary = re.sub(r'\*\s+', '*', summary)  # Remove space after opening italic
        summary = re.sub(r'\s+\*', '*', summary)  # Remove space before closing italic
        
        # Remove trailing whitespace from lines
        summary = '\n'.join(line.rstrip() for line in summary.split('\n'))
        
        # Remove leading/trailing empty lines
        summary = summary.strip()
        
        return summary
    
    async def _summarize_chunk_aggressive(self, chunk: SemanticChunk, user_prompt: str, model_func) -> Tuple[str, str]:
        """Aggressively summarize a single chunk with strict token limits."""
        
        # BALANCED COMPRESSION: Target ~500-600 tokens per chunk summary
        target_words = min(600, int(len(chunk.content.split()) * self.compression_ratio))
        
        # Get model name for logging
        model_name = "UNKNOWN"
        try:
            if hasattr(model_func, '__name__'):
                if 'openai' in model_func.__name__.lower():
                    model_name = "OPENAI"
                elif 'mistral' in model_func.__name__.lower():
                    model_name = "MISTRAL"
                elif 'claude' in model_func.__name__.lower():
                    model_name = "CLAUDE"
                elif 'gemini' in model_func.__name__.lower():
                    model_name = "GEMINI"
        except:
            pass
        
        prompt = f"""
Create an EXTREMELY CONCISE summary of this text segment for: "{user_prompt}"

Text segment ({chunk.token_count:,} tokens):
{chunk.content}

CRITICAL REQUIREMENTS:
- Maximum {target_words} words ONLY
- Use markdown formatting: **bold** for key terms, - for bullet points
- Extract ONLY the most essential points relevant to the user's request
- Use bullet points (-) for key facts, NO excessive line breaks
- NO verbose explanations or background context
- Focus on actionable information and key insights
- Single line breaks only, no double line breaks within summary
- If segment has no relevant content, state in 1-2 sentences maximum

Ultra-concise summary ({target_words} words max):"""
        
        try:
            model_name, response = await model_func(prompt)
            
            # EMERGENCY TRUNCATION: Ensure chunk summaries don't exceed limits
            words = response.split()
            if len(words) > target_words:
                print(f"📏 [{model_name}] Chunk {chunk.chunk_index} - Original summary length: {len(words)} words")
                print(f"⚠️  [{model_name}] Chunk {chunk.chunk_index} - Summary too long ({len(words)} words), truncating to {target_words}")
                response = ' '.join(words[:target_words]) + "..."
            
            return response, ""
        except Exception as e:
            # Get model name from the function if possible
            model_name = "UNKNOWN"
            try:
                # Try to extract model name from the function name
                if hasattr(model_func, '__name__'):
                    model_name = model_func.__name__.replace('get_', '').replace('_response', '').upper()
            except:
                pass
            
            self._log_error(f"[{model_name}] chunk {chunk.chunk_index}", e)
            return f"[{model_name}] Error processing chunk {chunk.chunk_index}: {str(e)}", str(e)
    
    async def _process_chunks_parallel(self, chunks: List[SemanticChunk], user_prompt: str, model_func) -> List[Tuple[str, str]]:
        """Process chunks in batches to avoid rate limits while staying fast."""
        # Get model name from function
        model_name = "UNKNOWN"
        try:
            if hasattr(model_func, '__name__'):
                if 'openai' in model_func.__name__.lower():
                    model_name = "OPENAI"
                elif 'mistral' in model_func.__name__.lower():
                    model_name = "MISTRAL"
                elif 'claude' in model_func.__name__.lower():
                    model_name = "CLAUDE"
                elif 'gemini' in model_func.__name__.lower():
                    model_name = "GEMINI"
        except:
            pass
            
        print(f"⚡ [{model_name}] Processing {len(chunks)} chunks in batches...")
        
        # Adjust batch size based on model for stability
        if model_name == "OPENAI":
            batch_size = 4  # Much smaller batches for OpenAI to avoid rate limits
        elif model_name == "MISTRAL":
            batch_size = len(chunks)  # ALL chunks at once for Mistral (2M TPM - no batching needed!)
        elif model_name == "CLAUDE":
            batch_size = 4  # Smaller batches for Claude Haiku to avoid rate limits
        elif model_name == "GEMINI":
            batch_size = len(chunks)  # ALL chunks at once for Gemini (high TPM - no batching needed!)
        else:
            batch_size = 10  # Default fallback
        all_results = []
        
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            batch_num = i//batch_size + 1
            total_batches = (len(chunks) + batch_size - 1)//batch_size
            print(f"   📦 [{model_name}] Processing batch {batch_num}/{total_batches} ({len(batch)} chunks) - chunks {i} to {min(i+batch_size, len(chunks))-1}...")
            
            # Process chunks in parallel within each batch
            try:
                tasks = [
                    self._summarize_chunk_aggressive(chunk, user_prompt, model_func)
                    for chunk in batch
                ]
                
                results = await asyncio.gather(*tasks, return_exceptions=True)
                print(f"      ✅ [{model_name}] Batch {batch_num} completed successfully")
            except Exception as e:
                print(f"      ❌ [{model_name}] Batch {batch_num} failed: {str(e)}")
                results = [Exception(f"Batch processing error: {str(e)}")] * len(batch)
            
            # Handle exceptions for this batch
            for j, result in enumerate(results):
                chunk_index = i + j
                if isinstance(result, Exception):
                    self._log_error(f"batch processing chunk {chunk_index}", result)
                    all_results.append((f"Error in chunk {chunk_index}: {str(result)}", str(result)))
                else:
                    all_results.append(result)
            
            # Small delays for OpenAI stability
            if i + batch_size < len(chunks):  # Don't delay after last batch
                if model_name == "OPENAI":
                    await asyncio.sleep(1)  # 1 second for OpenAI to avoid rate limits
                # No delay for other models
        
        return all_results
    
    async def _merge_summaries_recursive_optimized(self, summaries: List[str], user_prompt: str, 
                                                  model_func, level: int = 0, model_name: str = "UNKNOWN") -> Tuple[str, List[str]]:
        """
        Optimized recursive merging with strict token control and intermediate tracking.
        Returns: (final_summary, intermediate_summaries_list)
        """
        intermediate_summaries = []
        
        if len(summaries) <= 1:
            final_summary = summaries[0] if summaries else "No content to summarize"
            return final_summary, intermediate_summaries
        
        print(f"🔧 [{model_name.upper()}] Merge level {level}: {len(summaries)} summaries")
        
        # Base case: Final merge to target output
        if len(summaries) <= self.max_chunks_per_merge:
            #1: Calculate Combined Text 
            combined_text = "\n\n".join([f"Section {i+1}: {summary}" for i, summary in enumerate(summaries)])
            
            # CALCULATE TARGET: Ensure final output is exactly within 3500 tokens
            estimated_tokens = len(combined_text.split()) * 1.3  # Rough token estimation
            target_words = int(max(2500, min(4000, self.max_output_tokens // 1.1)))  # Convert to integer for slice indexing
            
            merge_prompt = f"""
Create a COMPREHENSIVE but CONCISE final summary from these sections for: "{user_prompt}"

Section summaries:
{combined_text}

FINAL SUMMARY REQUIREMENTS:
- EXACTLY {target_words} words maximum (CRITICAL - do not exceed)
- Use proper markdown formatting with clear headers (# ## ###)
- Use bullet points (-) and numbered lists (1. 2. 3.) for organization
- Use **bold** for key terms and *italics* for emphasis
- NO excessive line breaks or empty lines between paragraphs
- Single line break between sections, double line break only between major sections
- Comprehensive coverage of ALL key points across sections
- Logical flow and coherent structure
- NO redundancy between sections
- Focus on the user's specific request: "{user_prompt}"

Final Summary ({target_words} words max):"""
            
            try:
                _, final_summary = await model_func(merge_prompt)
                
                # STRICT TOKEN CONTROL: Ensure 3500 token limit
                words = final_summary.split()
                if len(words) > target_words:
                    print(f"⚠️  Final summary too long ({len(words)} words), truncating to {target_words}")
                    final_summary = ' '.join(words[:target_words]) + "\n\n[Summary truncated to meet token limit]"
                
                intermediate_summaries.append(combined_text)  # Store the pre-final stage
                return final_summary, intermediate_summaries
                
            except Exception as e:
                self._log_error(f"[{model_name.upper()}] merge level {level}", e)
                return f"[{model_name.upper()}] Error in final merge: {str(e)}", intermediate_summaries
        
        else:
            # Intermediate merge: Process in batches
            batch_summaries = []
            
            for i in range(0, len(summaries), self.max_chunks_per_merge):
                batch = summaries[i:i + self.max_chunks_per_merge]
                combined_batch = "\n\n".join([f"Part {j+1}: {summary}" for j, summary in enumerate(batch)])
                
                # Intermediate compression target - Conservative to stay within context limits
                # Each 600-word chunk summary ≈ 800 tokens, so we need to be very conservative
                target_words = min(600, int(len(combined_batch.split()) * 0.3))  # 30% compression for safety
                
                batch_prompt = f"""
Create a CONCISE intermediate summary combining these parts for: "{user_prompt}"

Parts to combine:
{combined_batch}

INTERMEDIATE SUMMARY REQUIREMENTS:
- Maximum {target_words} words ONLY
- Preserve ALL key information from each part
- Remove redundancy and verbose explanations
- Use bullet points for key facts
- Focus on information relevant to: "{user_prompt}"

Intermediate Summary ({target_words} words max):"""
                
                try:
                    _, batch_summary = await model_func(batch_prompt)
                    
                    # Truncate if needed/if summary is too long (le dernie/base case)
                    words = batch_summary.split()
                    if len(words) > target_words:
                        batch_summary = ' '.join(words[:target_words]) + "..."
                    
                    batch_summaries.append(batch_summary)
                    intermediate_summaries.append(combined_batch)  # Store this stage
                    
                except Exception as e:
                    error_msg = f"[{model_name.upper()}] Error in batch {i//self.max_chunks_per_merge}: {str(e)}"
                    batch_summaries.append(error_msg)
                    print(f"❌ {error_msg}")
            
            # Recursive call for next level
            final_summary, deeper_intermediates = await self._merge_summaries_recursive_optimized(
                batch_summaries, user_prompt, model_func, level + 1, model_name
            )
            
            intermediate_summaries.extend(deeper_intermediates)
            return final_summary, intermediate_summaries
    
    async def _calculate_final_stage_similarity(self, final_summary: str, last_stage_input: str, model_name: str = "UNKNOWN") -> float:
        """Calculate cosine similarity between final summary and last-stage input text."""
        try:
            if not last_stage_input or not final_summary:
                return 0.0
            
            # Get embeddings for both texts
            summary_embedding = await get_embedding(final_summary)
            input_embedding = await get_embedding(last_stage_input)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(
                np.array(summary_embedding).reshape(1, -1),
                np.array(input_embedding).reshape(1, -1)
            )[0][0]
            
            return float(similarity)
        except Exception as e:
            self._log_error(f"[{model_name.upper()}] final-stage similarity calculation", e)
            return 0.0
    
    async def _process_model_pipeline_optimized(self, model_name: str, chunks: List[SemanticChunk], 
                                              user_prompt: str) -> ModelSummaryResult:
        """Process complete model pipeline with optimized similarity calculation."""
        print(f"\n🚀 OPTIMIZED PIPELINE: {model_name.upper()}")
        start_time = time.time()
        
        try:
            model_func = self.model_functions[model_name]
            
            # STEP 1: Parallel chunk summarization
            print(f"⚡ [{model_name.upper()}] Step 1: Summarizing {len(chunks)} chunks...")
            chunk_results = await self._process_chunks_parallel(chunks, user_prompt, model_func)
            
            # Extract valid summaries
            valid_summaries = [result[0] for result in chunk_results if not result[0].startswith("Error")]
            errors = [result[1] for result in chunk_results if result[1]]
            
            if not valid_summaries:
                raise Exception("No valid chunk summaries generated")
            
            print(f"✅ [{model_name.upper()}] Generated {len(valid_summaries)} valid chunk summaries")
            
            # STEP 2: Factuality checking DISABLED for faster processing
            print(f"🚫 [{model_name.upper()}] Step 2: Factuality checking SKIPPED")
            factuality_results = []
            overall_factuality_score = 0.0  # Disabled - no factuality checking
            
            # STEP 3: Recursive merging with intermediate tracking
            print(f"⚡ [{model_name.upper()}] Step 3: Recursive merging...")
            final_summary, intermediate_summaries = await self._merge_summaries_recursive_optimized(
                valid_summaries, user_prompt, model_func, model_name=model_name
            )
            
            # STEP 4: Calculate similarity with LAST STAGE INPUT (not original document)
            print(f"⚡ [{model_name.upper()}] Step 4: Calculating final-stage similarity...")
            
            # Use the last intermediate summary as the "previous stage"
            last_stage_input = intermediate_summaries[-1] if intermediate_summaries else " ".join(valid_summaries)
            
            # Skip similarity calculation if OpenAI quota is exceeded
            try:
                final_similarity = await self._calculate_final_stage_similarity(final_summary, last_stage_input, model_name)
            except Exception as e:
                print(f"⚠️  [{model_name.upper()}] Skipping similarity calculation due to error: {str(e)}")
                final_similarity = 0.5  # Default similarity score
            
            processing_time = time.time() - start_time
            
            print(f"✅ [{model_name.upper()}] pipeline complete in {processing_time:.2f}s")
            print(f"   📊 [{model_name.upper()}] Final similarity: {final_similarity:.3f}")
            # print(f"   🔍 [{model_name.upper()}] Factuality score: {overall_factuality_score:.3f}")  # DISABLED
            print(f"   📝 [{model_name.upper()}] Output length: {len(final_summary.split())} words")
            
            return ModelSummaryResult(
                model_name=model_name,
                summary=final_summary,
                chunks_processed=len(chunks),
                final_similarity=final_similarity,
                processing_time=processing_time,
                intermediate_summaries=intermediate_summaries,
                # factuality_results=factuality_results,  # DISABLED
                # overall_factuality_score=overall_factuality_score,  # DISABLED
                error="; ".join(errors) if errors else None
            )
            
        except Exception as e:
            self._log_error(f"[{model_name.upper()}] pipeline", e)
            processing_time = time.time() - start_time
            
            return ModelSummaryResult(
                model_name=model_name,
                summary=f"Error in {model_name} pipeline: {str(e)}",
                chunks_processed=len(chunks),
                final_similarity=0.0,
                processing_time=processing_time,
                intermediate_summaries=[],
                # factuality_results=[],  # DISABLED
                # overall_factuality_score=0.0,  # DISABLED
                error=str(e)
            )
    
    async def _process_single_model_complete(self, model_name: str, text: str, user_prompt: str) -> ModelSummaryResult:
        """Process complete single model pipeline from chunking to final summary."""
        print(f"\n🚀 COMPLETE PIPELINE: {model_name.upper()}")
        
        try:
            # STEP 1: Lightning-fast chunking
            print(f"⚡ Creating chunks for {model_name}...")
            chunks = await asyncio.to_thread(
                self.semantic_chunker.create_semantic_chunks, 
                text, 
                model_name
            )
            
            if not chunks:
                raise Exception(f"No chunks created for {model_name}")
            
            # STEP 2: Complete pipeline processing
            return await self._process_model_pipeline_optimized(model_name, chunks, user_prompt)
            
        except Exception as e:
            self._log_error(f"complete pipeline for {model_name}", e)
            return ModelSummaryResult(
                model_name=model_name,
                summary=f"Complete pipeline error: {str(e)}",
                chunks_processed=0,
                final_similarity=0.0,
                processing_time=0.0,
                intermediate_summaries=[],
                # factuality_results=[],  # DISABLED
                # overall_factuality_score=0.0,  # DISABLED
                error=str(e)
            )
    
    async def summarize_document(self, text: str, user_prompt: str) -> HierarchicalSummaryResult:
        """
        🚀 MAIN METHOD: Lightning-fast hierarchical summarization with optimized performance.
        
        Features:
        - Max 3500 token output
        - No document-summary similarity (as requested)
        - Final-stage similarity calculation only
        - Parallel model processing
        - Aggressive compression for speed
        """
        print(f"\n🚀 OPTIMIZED HIERARCHICAL SUMMARIZATION")
        print(f"📄 Document: {len(text):,} chars, {len(text.split()):,} words")
        print(f"🎯 Target output: max {self.max_output_tokens} tokens")
        print(f"❌ Document-summary similarity: DISABLED (as requested)")
        print(f"✅ Final-stage similarity: ENABLED")
        
        start_time = time.time()
        
        # Launch all four model pipelines in parallel
        model_tasks = []
        selected_models = ["openai", "mistral", "claude", "gemini"]  # All four models
        
        for model_name in selected_models:
            if model_name in self.semantic_chunker.tokenizers.keys() and model_name in self.model_functions:
                task = self._process_single_model_complete(model_name, text, user_prompt)
                model_tasks.append((model_name, task))
        
        print(f"⚡ Launching {len(model_tasks)} model pipelines in parallel (OpenAI + Mistral + Claude + Gemini)...")
        
        # Execute all pipelines in parallel
        model_results = {}
        if model_tasks:
            results = await asyncio.gather(*(task for _, task in model_tasks), return_exceptions=True)
            
            for (model_name, _), result in zip(model_tasks, results):
                if isinstance(result, Exception):
                    self._log_error(f"pipeline for {model_name}", result)
                    model_results[model_name] = ModelSummaryResult(
                        model_name=model_name,
                        summary=f"Pipeline exception: {str(result)}",
                        chunks_processed=0,
                        final_similarity=0.0,
                        processing_time=0.0,
                        intermediate_summaries=[],
                        # factuality_results=[],  # DISABLED
                        # overall_factuality_score=0.0,  # DISABLED
                        error=str(result)
                    )
                else:
                    model_results[model_name] = result
        
        # Select best model based on final-stage similarity (NOT document similarity)
        best_model = "none"
        best_similarity = 0.0
        best_summary = "No valid summaries generated"
        
        print(f"\n📊 MODEL COMPARISON (Final-Stage Similarity):")
        for model_name, result in model_results.items():
            similarity_status = f"{result.final_similarity:.3f}" if result.final_similarity > 0 else "ERROR"
            # factuality_status = f"{result.overall_factuality_score:.3f}" if result.overall_factuality_score else "N/A"  # DISABLED
            print(f"   • {model_name}: Similarity={similarity_status}")  # Factuality disabled
            
            if result.final_similarity > best_similarity:
                best_model = model_name
                best_similarity = result.final_similarity
                best_summary = result.summary
        
        print(f"\n🎯 SUMMARIZATION COMPLETE:")
        print(f"   ⚡ Total time: {time.time() - start_time:.2f}s")
        print(f"   🏆 Best model: {best_model} (similarity: {best_similarity:.3f})")
        print(f"   📝 Output: {len(best_summary.split())} words")
        print(f"   📊 Compression: {len(best_summary.split()) / len(text.split()) * 100:.1f}%")
        
        # Format the final summary for better markdown rendering
        formatted_summary = self._format_markdown_summary(best_summary)
        
        # Print the final summary
        print(f"\n📝 FINAL SUMMARY:\n{formatted_summary}")
        
        return HierarchicalSummaryResult(
            final_summary=formatted_summary,
            best_model=best_model,
            best_similarity=best_similarity,
            model_results=model_results,
            processing_metadata={
                "total_time": time.time() - start_time,
                "compression_ratio": len(best_summary.split()) / len(text.split())
            }
        )
    
    def get_detailed_report(self, result: HierarchicalSummaryResult) -> Dict[str, Any]:
        """Generate detailed performance analysis report."""
        report = {
            "summary": {
                "best_model": result.best_model,
                "final_stage_similarity": result.best_similarity,
                "final_summary": result.final_summary,
                "output_length_words": len(result.final_summary.split()),
                "compression_ratio": result.processing_metadata.get("compression_ratio", 0)
            },
            "model_performance": {},
            "processing_metadata": result.processing_metadata,
            "optimization_notes": [
                f"Max output tokens: {result.processing_metadata.get('max_output_tokens', 'N/A')}",
                "Document-summary similarity: DISABLED (as requested)",
                "Final-stage similarity: ENABLED",
                "Aggressive compression: ENABLED"
            ]
        }
        
        # Analyze each model's performance
        for model_name, model_result in result.model_results.items():
            # factuality_stats = {}  # DISABLED - Factuality checking removed
            # if model_result.factuality_results:  # DISABLED
            #     total_claims = sum(len(fr.factual_claims) for fr in model_result.factuality_results)
            #     verified_claims = sum(
            #         len([c for c in fr.factual_claims if c.verification_status == 'verified'])
            #         for fr in model_result.factuality_results
            #     )
            #     disputed_claims = sum(
            #         len([c for c in fr.factual_claims if c.verification_status == 'disputed'])
            #         for fr in model_result.factuality_results
            #     )
            #     factuality_stats = {
            #         "total_factual_claims": total_claims,
            #         "verified_claims": verified_claims,
            #         "disputed_claims": disputed_claims,
            #         "verification_rate": verified_claims / max(total_claims, 1) * 100,
            #         "overall_factuality_score": model_result.overall_factuality_score
            #     }
            
            report["model_performance"][model_name] = {
                "final_stage_similarity": model_result.final_similarity,
                "chunks_processed": model_result.chunks_processed,
                "processing_time": model_result.processing_time,
                "chunks_per_second": model_result.chunks_processed / max(model_result.processing_time, 0.001),
                "intermediate_stages": len(model_result.intermediate_summaries),
                "error_rate": 1.0 if model_result.error else 0.0,
                "output_length_words": len(model_result.summary.split()),
                # "factuality_analysis": factuality_stats  # DISABLED - Factuality checking removed
            }
        
        return report

# Alias for backward compatibility  
HierarchicalSummarizer = OptimizedHierarchicalSummarizer 