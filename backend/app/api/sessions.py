from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.services.session import SessionService
from app.services.device import device_service
from app.models.user import User
from app.schemas.session import SessionResponse, SessionCreate

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("/check-limit", response_model=dict)
def check_device_limit(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user can create new session without exceeding device limit"""
    
    device_info = device_service.extract_device_info(request)
    session_service = SessionService(db)
    
    # Use the session service's built-in device limit check
    result = session_service.create_session(
        user=current_user,
        device_info=device_info,
        ip_address=device_info.ip_address
    )
    
    return result

@router.post("/", response_model=dict)
def create_session(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new session for authenticated user"""
    
    device_info = device_service.extract_device_info(request)
    session_service = SessionService(db)
    
    result = session_service.create_session(
        user=current_user,
        device_info=device_info,
        ip_address=device_info.ip_address
    )
    
    return result

@router.get("/", response_model=List[SessionResponse])
def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active sessions for current user"""
    
    session_service = SessionService(db)
    sessions = session_service.get_active_sessions(current_user.id)
    
    return [
        SessionResponse(
            session_id=str(session.id),
            device_info=session.device_info,
            ip_address=session.ip_address,
            created_at=session.created_at,
            last_activity=session.last_activity,
            is_current=False
        )
        for session in sessions
    ]

@router.delete("/{session_id}")
def terminate_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Terminate a specific session"""
    
    session_service = SessionService(db)
    success = session_service.terminate_session(current_user.id, session_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Session terminated successfully"}

@router.post("/force")
def force_create_session(
    request: Request,
    force_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Force create session by terminating selected session"""
    
    force_session_id = force_data.get("force_session_id")
    if not force_session_id:
        raise HTTPException(status_code=400, detail="force_session_id required")
    
    device_info = device_service.extract_device_info(request)
    session_service = SessionService(db)
    
    result = session_service.create_session(
        user=current_user,
        device_info=device_info,
        ip_address=device_info.ip_address,
        force_session_id=force_session_id
    )
    
    return result