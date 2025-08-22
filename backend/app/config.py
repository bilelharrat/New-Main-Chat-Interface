import os
from dotenv import load_dotenv
from typing import List

# Load environment variables
load_dotenv(override=True)

# API Keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
CLAUDE_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")  # Map to your .env name
GEMINI_API_KEY = os.environ.get("GOOGLE_API_KEY", "")     # Map to your .env name
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")

# CORS Settings - support both local and production
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
CORS_ORIGINS = [
    "http://localhost:3000", 
    "http://localhost:8002",  # For local testing
    "https://b099be754b8b.ngrok.app",  # Ngrok tunnel
    "https://frontend-newest.vercel.app", 
    "https://frontend-newest-dxi3vawv4-katias-projects-a6e20719.vercel.app",
    "https://frontend-newest-katias-projects-a6e20719.vercel.app",
    "https://frontend-newest-katiamoussar-4476-katias-projects-a6e20719.vercel.app",
    "https://frontend-newest-7vs8kj6ff-katias-projects-a6e20719.vercel.app/",
    "https://frontend-newest-katias-projects-a6e20719.vercel.app",
    "https://frontend-newest-katiamoussar-4476-katias-projects-a6e20719.vercel.app",
    "https://frontend-newest-katiamoussar-4476-katias-projects-a6e20719.vercel.app",
    # NEW DEPLOYMENT URLs
    "https://frontend-newest-g7uxqu81r-katias-projects-a6e20719.vercel.app",  # Production
    "https://frontend-newest-it3sahkoh-katias-projects-a6e20719.vercel.app",  # Preview
    "https://frontend-newest-13n406ivv-katias-projects-a6e20719.vercel.app",  # Previous Production
    "https://frontend-newest-6ollgtdhh-katias-projects-a6e20719.vercel.app",  # Latest Production
    "http://localhost:3001", 
    "http://frontend-newest-katiamoussar-4476-katias-projects-a6e20719.vercel.app",
    "https://final-ui-six.vercel.app",
    "https://final-jbayyj4wo-katias-projects-a6e20719.vercel.app"
    "http://localhost:8001", # Local development
    FRONTEND_URL  # Environment-specific URL
]

# Remove duplicates and empty strings
CORS_ORIGINS = list(filter(None, list(set(CORS_ORIGINS))))

CORS_CREDENTIALS = True
CORS_METHODS = ["*"]
CORS_HEADERS = ["*"]

# Environment settings
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
DEBUG = os.environ.get("DEBUG", "true").lower() == "true"

# LLM Model Settings
LLM_MODELS = {
    "openai": "gpt-3.5-turbo",
    "claude": "claude-3-5-haiku-20241022", 
    "gemini": "gemini-2.5-pro",
    "mistral": "mistral-small-2503"  # Latest free model
}

# Embedding Model Settings
EMBEDDING_MODEL = "text-embedding-ada-002"
EMBEDDING_MAX_TOKENS = 8000
EMBEDDING_BATCH_SIZE = 100

# Retry Settings - More conservative for Claude and Gemini
RETRY_ATTEMPTS = 2
RETRY_MULTIPLIER = 2
RETRY_MIN = 2
RETRY_MAX = 8 