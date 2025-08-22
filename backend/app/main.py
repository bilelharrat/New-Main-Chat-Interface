from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import router
from app.api.telemetry_routes import router as telemetry_router
from app.config import (
    CORS_ORIGINS, CORS_CREDENTIALS,
    CORS_METHODS, CORS_HEADERS
)
from app.services.telemetry_service import telemetry
import logging

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await telemetry.log_app_start()
    logging.info("Application startup")
    yield
    # Shutdown (if needed)
    logging.info("Application shutdown")

# Initialize FastAPI app=
app = FastAPI(
    title="AI Best Response",
    description="An API that compares responses from multiple LLMs to provide the most relevant answer",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_CREDENTIALS,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include routers
app.include_router(router)
app.include_router(telemetry_router) 