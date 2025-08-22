import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import aiofiles # pip install
from pathlib import Path
import hashlib
import platform
import psutil # pip install
import time
import logging
from fastapi import FastAPI

class TelemetryService:
    def __init__(self, data_dir: str = "telemetry_data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.session_id = str(uuid.uuid4())
        self.user_id = self._get_or_create_user_id()
        
    def _get_or_create_user_id(self) -> str:
        """Get or create a persistent anonymous user ID."""
        user_id_file = self.data_dir / "user_id.txt"
        if user_id_file.exists():
            with open(user_id_file, 'r') as f:
                return f.read().strip()
        else:
            # Create anonymous ID based on machine characteristics
            machine_info = f"{platform.node()}{platform.machine()}{platform.processor()}"
            user_id = hashlib.sha256(machine_info.encode()).hexdigest()[:16]
            with open(user_id_file, 'w') as f:
                f.write(user_id)
            return user_id
    
    async def log_event(self, event_type: str, data: Dict[str, Any] = None):
        """Log a telemetry event."""
        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "session_id": self.session_id,
            "user_id": self.user_id,
            "event_type": event_type,
            "data": data or {}
        }
        
        # Write to daily log file
        today = datetime.now().strftime("%Y-%m-%d")
        log_file = self.data_dir / f"events_{today}.jsonl"
        
        async with aiofiles.open(log_file, 'a') as f:
            await f.write(json.dumps(event) + "\n")
    
    async def log_app_start(self):
        """Log application startup."""
        system_info = {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "memory_gb": round(psutil.virtual_memory().total / (1024**3), 2)
        }
        
        await self.log_event("app_start", {
            "system_info": system_info
        })
    
    async def log_query(self, prompt: str, response_data: Dict[str, Any]):
        """Log a user query and response."""
        # Hash the prompt for privacy
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()[:16]
        
        await self.log_event("query", {
            "prompt_hash": prompt_hash,
            "prompt_length": len(prompt),
            "best_model": response_data.get("best_model"),
            "similarity_score": response_data.get("similarity_score"),
            "response_length": len(response_data.get("best_response", "")),
            "models_used": list(response_data.get("all_responses", {}).keys()),
            "error_models": [
                model for model, response in response_data.get("all_responses", {}).items()
                if response.startswith("Error:")
            ]
        })
    
    async def log_query_event(self, prompt: str, operation_type: str, start_time: float, additional_data: Dict[str, Any] = None):
        """Log a query event with timing and additional metadata."""
        current_time = time.time()
        duration_ms = (current_time - start_time) * 1000
        
        # Hash the prompt for privacy
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()[:16]
        
        event_data = {
            "prompt_hash": prompt_hash,
            "prompt_length": len(prompt),
            "operation_type": operation_type,
            "duration_ms": duration_ms,
            "timestamp": current_time
        }
        
        # Add additional data if provided
        if additional_data:
            event_data.update(additional_data)
        
        await self.log_event("query_event", event_data)
    
    async def log_error_event(self, operation_type: str, error_message: str, context: Dict[str, Any] = None):
        """Log an error event."""
        event_data = {
            "operation_type": operation_type,
            "error_message": error_message,
            "context": context or {}
        }
        
        await self.log_event("error_event", event_data)
    
    async def log_performance_metrics(self, metrics: Dict[str, Any]):
        """Log performance metrics."""
        await self.log_event("performance_metrics", metrics)
    
    async def log_error(self, error_type: str, error_message: str, context: Dict[str, Any] = None):
        """Log an error event."""
        await self.log_event("error", {
            "error_type": error_type,
            "error_message": error_message,
            "context": context or {}
        })
    
    async def log_performance(self, operation: str, duration_ms: float, success: bool):
        """Log performance metrics."""
        await self.log_event("performance", {
            "operation": operation,
            "duration_ms": duration_ms,
            "success": success
        })

# Global telemetry instance
telemetry = TelemetryService()

app = FastAPI()

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

@app.get("/")
async def root():
    logging.info("Root endpoint was called")
    return {"message": "Hello World"} 