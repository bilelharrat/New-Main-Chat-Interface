import json
from datetime import datetime, timedelta
from pathlib import Path
from fastapi import APIRouter
from typing import Dict, List, Any

router = APIRouter(prefix="/telemetry")

def load_telemetry_data(days: int = 7) -> List[Dict[str, Any]]:
    """Load telemetry data from the last N days."""
    data_dir = Path("telemetry_data")
    events = []
    
    for i in range(days):
        date = datetime.now() - timedelta(days=i)
        log_file = data_dir / f"events_{date.strftime('%Y-%m-%d')}.jsonl"
        
        if log_file.exists():
            with open(log_file, 'r') as f:
                for line in f:
                    try:
                        event = json.loads(line.strip())
                        events.append(event)
                    except json.JSONDecodeError:
                        continue
    
    return events

@router.get("/dashboard")
async def get_telemetry_dashboard():
    """Get telemetry dashboard data."""
    events = load_telemetry_data()
    
    # Basic analytics
    total_events = len(events)
    unique_users = len(set(event.get('user_id') for event in events))
    unique_sessions = len(set(event.get('session_id') for event in events))
    
    # Event type breakdown
    event_types = {}
    for event in events:
        event_type = event.get('event_type', 'unknown')
        event_types[event_type] = event_types.get(event_type, 0) + 1
    
    # Query analytics
    query_events = [e for e in events if e.get('event_type') == 'query']
    total_queries = len(query_events)
    
    model_usage = {}
    avg_similarity = 0
    if query_events:
        for event in query_events:
            data = event.get('data', {})
            model = data.get('best_model')
            if model:
                model_usage[model] = model_usage.get(model, 0) + 1
            
            similarity = data.get('similarity_score', 0)
            avg_similarity += similarity
        
        avg_similarity = avg_similarity / len(query_events) if query_events else 0
    
    # Performance analytics
    performance_events = [e for e in events if e.get('event_type') == 'performance']
    avg_query_time = 0
    if performance_events:
        query_times = [e.get('data', {}).get('duration_ms', 0) for e in performance_events]
        avg_query_time = sum(query_times) / len(query_times) if query_times else 0
    
    # Error analytics
    error_events = [e for e in events if e.get('event_type') == 'error']
    error_rate = len(error_events) / total_events if total_events > 0 else 0
    
    return {
        "overview": {
            "total_events": total_events,
            "unique_users": unique_users,
            "unique_sessions": unique_sessions,
            "total_queries": total_queries,
            "error_rate": round(error_rate * 100, 2)
        },
        "event_types": event_types,
        "model_usage": model_usage,
        "performance": {
            "avg_query_time_ms": round(avg_query_time, 2),
            "avg_similarity_score": round(avg_similarity, 3)
        },
        "errors": {
            "total_errors": len(error_events),
            "error_types": {}
        }
    }

@router.get("/events")
async def get_recent_events(limit: int = 100):
    """Get recent telemetry events."""
    events = load_telemetry_data()
    # Sort by timestamp and limit
    events.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    return events[:limit] 