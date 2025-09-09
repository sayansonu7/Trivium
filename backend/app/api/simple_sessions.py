from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.services.simple_session import SimpleSessionService
from app.models.user import User

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("/create")
def create_session(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new session and check device limit"""
    
    service = SimpleSessionService(db)
    user_agent = request.headers.get("user-agent", "Unknown Browser")
    client_ip = request.client.host if request.client else "unknown"
    
    result = service.create_session(
        user=current_user,
        device_info=user_agent,
        ip_address=client_ip
    )
    
    return result

@router.post("/force-create")
def force_create_session(
    request: Request,
    force_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Force create session by terminating selected session"""
    
    force_session_id = force_data.get("session_id")
    if not force_session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    service = SimpleSessionService(db)
    
    print(f"Force terminating session: {force_session_id} for user: {current_user.id}")
    
    # Terminate the selected session FIRST
    terminated = service.terminate_session(current_user.id, force_session_id)
    if not terminated:
        raise HTTPException(status_code=404, detail="Session not found")
    
    print(f"Session {force_session_id} terminated successfully")
    
    # Now create new session (this should work since we freed up a slot)
    user_agent = request.headers.get("user-agent", "Unknown Browser")
    client_ip = request.client.host if request.client else "unknown"
    
    result = service.create_session(
        user=current_user,
        device_info=user_agent,
        ip_address=client_ip,
        force_create=True
    )
    
    print(f"New session creation result: {result}")
    return result