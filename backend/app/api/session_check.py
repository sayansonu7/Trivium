from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.services.simple_session import SimpleSessionService
from app.models.user import User

router = APIRouter(prefix="/api/session", tags=["session-check"])

@router.get("/validate")
def validate_session(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if current session is still valid"""
    
    service = SimpleSessionService(db)
    active_sessions = service.get_active_sessions(current_user.id)
    
    # Get current device info
    user_agent = request.headers.get("user-agent", "")
    
    # Check if any active session matches current device
    for session in active_sessions:
        session_ua = session.device_info.get("browser", "") if isinstance(session.device_info, dict) else ""
        if user_agent and session_ua in user_agent:
            return {"valid": True, "session_id": session.id}
    
    # No matching session found - user was logged out
    return {"valid": False, "message": "Session terminated by another device"}