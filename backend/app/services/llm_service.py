import asyncio
from typing import Dict, Tuple, List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
import openai
import anthropic
import google.generativeai as genai
from mistralai.client import MistralClient

from app.config import (
    OPENAI_API_KEY, CLAUDE_API_KEY, GEMINI_API_KEY, MISTRAL_API_KEY,
    RETRY_ATTEMPTS, RETRY_MULTIPLIER, RETRY_MIN, RETRY_MAX
)



# Initialize clients
openai_client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
claude_client = anthropic.AsyncAnthropic(api_key=CLAUDE_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
mistral_client = MistralClient(api_key=MISTRAL_API_KEY)

@retry(stop=stop_after_attempt(RETRY_ATTEMPTS), 
       wait=wait_exponential(multiplier=RETRY_MULTIPLIER, min=RETRY_MIN, max=RETRY_MAX))
async def get_openai_response(prompt: str, model: str = "gpt-3.5-turbo") -> Tuple[str, str]:
    """Get response from OpenAI GPT model."""
    try:
        response = await openai_client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000, # max output tokens 
            temperature=0.7, # creativity and randomness
            timeout = 120
        )
        return "openai", response.choices[0].message.content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

@retry(stop=stop_after_attempt(2), 
       wait=wait_exponential(multiplier=3, min=3, max=15))
async def get_claude_response(prompt: str, model: str = "claude-3-5-haiku-20241022") -> Tuple[str, str]:
    """Get response from Anthropic Claude model with conservative retry."""
    try:
        response = await claude_client.messages.create(
            model=model,
            max_tokens=4000,
            temperature=0.7,
            messages=[{"role": "user", "content": prompt}],
            timeout=60  # Shorter timeout
        )
        return "claude", response.content[0].text
    except Exception as e:
        raise Exception(f"Claude API error: {str(e)}")

@retry(stop=stop_after_attempt(2),
       wait=wait_exponential(multiplier=3, min=3, max=15))
async def get_gemini_response(prompt: str, model: str = "gemini-2.5-pro") -> Tuple[str, str]:
    """Get response from Google Gemini model with conservative retry."""
    try:
        # Configure with proper settings for API key
        genai.configure(api_key=GEMINI_API_KEY)
        model_instance = genai.GenerativeModel(model)
        
        # Add generation config for better control
        generation_config = {
            "temperature": 0.7,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 4000,
        }
        
        response = await asyncio.to_thread(
            model_instance.generate_content,
            prompt,
            generation_config=generation_config
        )
        return "gemini", response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

@retry(stop=stop_after_attempt(RETRY_ATTEMPTS),
       wait=wait_exponential(multiplier=RETRY_MULTIPLIER, min=RETRY_MIN, max=RETRY_MAX))
async def get_mistral_response(prompt: str, model: str = "mistral-small-2503") -> Tuple[str, str]:
    """Get response from Mistral AI model."""
    try:
        from mistralai.models.chat_completion import ChatMessage
        response = await asyncio.to_thread(
            mistral_client.chat,
            model=model,
            messages=[ChatMessage(role="user", content=prompt)],
            max_tokens=4000,
            temperature=0.7
        )
        return "mistral", response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Mistral API error: {str(e)}")

async def get_all_llm_responses(prompt: str) -> Dict[str, str]:
    """Get responses from all available LLM models in parallel."""
    
    async def safe_call(func, model_name):
        try:
            model, response = await func(prompt)
            return model_name, response
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            return model_name, f"Error: {str(e)}"
    
    # Call all models in parallel
    tasks = [
        safe_call(get_openai_response, "openai"),
        safe_call(get_claude_response, "claude"),
        safe_call(get_gemini_response, "gemini"),
        safe_call(get_mistral_response, "mistral")
    ]
    
    results = await asyncio.gather(*tasks)
    return dict(results)

# Enhanced functions for hierarchical processing
async def get_model_response_with_retry(model_name: str, prompt: str) -> Tuple[str, str]:
    """Get response from a specific model with enhanced error handling."""
    model_functions = {
        "openai": get_openai_response,
        "claude": get_claude_response,
        "gemini": get_gemini_response,
        "mistral": get_mistral_response
    }
    
    if model_name not in model_functions:
        return model_name, f"Error: Unknown model {model_name}"
    
    try:
        return await model_functions[model_name](prompt)
    except Exception as e:
        return model_name, f"Error: {str(e)}"

def get_model_context_limits() -> Dict[str, int]:
    """Get context limits for each model."""
    return {
        "openai": 16385,       # GPT-3.5 Turbo
        "claude": 200000,      # Claude 3.5 Sonnet  
        "gemini": 2000000,     # Gemini 1.5 Pro
        "mistral": 128000,     # Mistral Large
    }

def get_model_optimal_chunk_size(model_name: str, prompt_overhead: int = 1000) -> int:
    """Get optimal chunk size for a model, accounting for prompt overhead."""
    limits = get_model_context_limits()
    if model_name not in limits:
        return 8000  # Default conservative size
    
    # Reserve space for prompt, instructions, and response
    usable_context = limits[model_name] - prompt_overhead - 4000  # 4000 for response
    return max(1000, int(usable_context * 0.8))  # Use 80% of available context 

async def get_llm_summary_batch(model_func, model_name: str, document_texts: List[str], user_prompt: str) -> List[Tuple[str, str]]:
    """Get summaries from a specific LLM for a batch of documents."""
    tasks = []
    for document_text in document_texts:
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
        tasks.append(model_func(full_prompt))

    return await asyncio.gather(*tasks)

# Example usage for batching
async def get_all_summaries_batch(document_texts: List[str], user_prompt: str) -> Dict[str, List[str]]:
    """Get summaries from all LLMs for a batch of documents."""
    tasks = {
        "openai": get_llm_summary_batch(get_openai_response, "openai", document_texts, user_prompt),
        "claude": get_llm_summary_batch(get_claude_response, "claude", document_texts, user_prompt),
        "gemini": get_llm_summary_batch(get_gemini_response, "gemini", document_texts, user_prompt),
        "mistral": get_llm_summary_batch(get_mistral_response, "mistral", document_texts, user_prompt),
    }

    results = await asyncio.gather(*tasks.values())
    return {model: result for model, result in zip(tasks.keys(), results)}
