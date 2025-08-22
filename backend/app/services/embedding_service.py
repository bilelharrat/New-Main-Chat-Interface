import asyncio
from typing import List, Dict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import openai
import tiktoken
from app.config import OPENAI_API_KEY, EMBEDDING_MODEL, EMBEDDING_MAX_TOKENS, EMBEDDING_BATCH_SIZE

# Initialize OpenAI client
openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Initialize tokenizer for token counting
try:
    tokenizer = tiktoken.encoding_for_model("text-embedding-ada-002")
except:
    tokenizer = tiktoken.get_encoding("cl100k_base")

# Embedding limits for text-embedding-ada-002
MAX_TOKENS_PER_REQUEST = EMBEDDING_MAX_TOKENS  # Configurable limit
MAX_ITEMS_PER_BATCH = EMBEDDING_BATCH_SIZE     # Configurable batch size

def count_tokens(text: str) -> int:
    """Count tokens in text for embedding model."""
    try:
        return len(tokenizer.encode(text))
    except:
        # Fallback: approximate 4 chars per token
        return len(text) // 4

def truncate_text_for_embedding(text: str, max_tokens: int = MAX_TOKENS_PER_REQUEST) -> str:
    """Truncate text to fit within embedding token limits."""
    token_count = count_tokens(text)
    if token_count <= max_tokens:
        return text
    
    # Truncate to approximate character limit
    char_limit = max_tokens * 4  # Approximate 4 chars per token
    return text[:char_limit]

async def get_embedding(text: str) -> List[float]:
    """Get embedding for text using OpenAI's text-embedding-ada-002 model."""
    try:
        # Truncate text if too long
        truncated_text = truncate_text_for_embedding(text)
        
        response = await asyncio.to_thread(
            openai_client.embeddings.create,
            model=EMBEDDING_MODEL,
            input=truncated_text
        )
        return response.data[0].embedding
    except Exception as e:
        raise Exception(f"Error getting embedding: {str(e)}")

async def get_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """Get embeddings for multiple texts using OpenAI's text-embedding-ada-002 model."""
    try:
        # Truncate all texts to prevent token limit errors
        truncated_texts = [truncate_text_for_embedding(text) for text in texts]
        
        # Process in smaller batches if too many items
        all_embeddings = []
        
        for i in range(0, len(truncated_texts), MAX_ITEMS_PER_BATCH):
            batch = truncated_texts[i:i + MAX_ITEMS_PER_BATCH]
            
            response = await asyncio.to_thread(
                openai_client.embeddings.create,
                model=EMBEDDING_MODEL,
                input=batch
            )
            
            batch_embeddings = [data.embedding for data in response.data]
            all_embeddings.extend(batch_embeddings)
        
        return all_embeddings
        
    except Exception as e:
        raise Exception(f"Error getting batch embeddings: {str(e)}")

def calculate_cosine_similarities(query_embedding: List[float], response_embeddings: List[List[float]]) -> List[float]:
    """Calculate cosine similarities between query embedding and multiple response embeddings."""
    try:
        similarities = []
        query_array = np.array(query_embedding).reshape(1, -1)
        
        for response_embedding in response_embeddings:
            response_array = np.array(response_embedding).reshape(1, -1)
            similarity = cosine_similarity(query_array, response_array)[0][0]
            similarities.append(float(similarity))
        
        return similarities
    except Exception as e:
        # Return zeros if calculation fails
        return [0.0] * len(response_embeddings)

async def calculate_similarities(query_embedding: List[float], responses: Dict[str, str]) -> Dict[str, float]:
    """Calculate similarities between query embedding and response embeddings."""
    # Get valid responses
    valid_responses = {model: response for model, response in responses.items() 
                      if not response.startswith("Error:")}
    
    # Initialize similarities with 0.0 for error responses
    similarities = {model: 0.0 for model in responses if model not in valid_responses}
    
    if not valid_responses:
        return similarities
        
    try:
        # Get embeddings for valid responses
        response_texts = list(valid_responses.values())
        response_embeddings = await get_embeddings_batch(response_texts)
        
        # Calculate similarities
        for (model, _), embedding in zip(valid_responses.items(), response_embeddings):
            similarity = cosine_similarity(
                np.array(query_embedding).reshape(1, -1),
                np.array(embedding).reshape(1, -1)
            )[0][0]
            similarities[model] = similarity
            
    except Exception as e:
        # If anything fails, set all valid responses to 0.0
        similarities.update({model: 0.0 for model in valid_responses})
    
    return similarities 