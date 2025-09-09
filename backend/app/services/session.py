from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.user import User
from app.models.session import UserSession
from app.schemas.session import DeviceInfo
from app.config import settings
import uuid
from datetime import datetime, timedelta

class SessionService:
    def __init__(self, db: Session):
        self.db = db
        self.max_devices = getattr(settings, 'max_devices_per_user', 3)
    
    def create_session(
        self, 
        user: User, 
        device_info: DeviceInfo, 
        ip_address: str,
        force_session_id: Optional[str] = None
    ) -> Dict:
        """Create new session for user"""
        from app.services.device import device_service
        
        # Generate unique device fingerprint for each session
        device_fingerprint = device_service.generate_device_fingerprint(device_info)
        
        # Get ALL active sessions (each browser tab is separate)
        active_sessions = self.get_active_sessions(user.id)
        
        # Check device limit - CRITICAL: This enforces MAX 3 sessions
        if len(active_sessions) >= self.max_devices:
            if not force_session_id:
                print(f"Device limit exceeded: {len(active_sessions)} >= {self.max_devices}")
                return {
                    "status": "device_limit_exceeded",
                    "current_sessions": [self._session_to_dict(s) for s in active_sessions],
                    "max_devices": self.max_devices
                }
            else:
                # Terminate the forced session
                print(f"Force terminating session: {force_session_id}")
                self.terminate_session(user.id, force_session_id)
        
        # Create new session
        session_token = str(uuid.uuid4())
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            device_info=device_info.dict(),
            device_fingerprint=device_fingerprint,
            ip_address=ip_address,
            is_active=True
        )
        
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        return {
            "status": "success",
            "session_id": session.id,
            "session_token": session_token
        }
    
    def get_active_sessions(self, user_id: int) -> List[UserSession]:
        """Get all active sessions for user"""
        return self.db.query(UserSession).filter(
            and_(
                UserSession.user_id == user_id,
                UserSession.is_active == True
            )
        ).all()
    
    def terminate_session(self, user_id: int, session_id: str) -> bool:
        """Terminate specific session"""
        session = self.db.query(UserSession).filter(
            and_(
                UserSession.id == session_id,
                UserSession.user_id == user_id,
                UserSession.is_active == True
            )
        ).first()
        
        if session:
            session.is_active = False
            self.db.commit()
            return True
        return False
    
    def update_session_activity(self, session_id: str) -> bool:
        """Update session last activity"""
        session = self.db.query(UserSession).filter(
            and_(
                UserSession.id == session_id,
                UserSession.is_active == True
            )
        ).first()
        
        if session:
            session.last_activity = datetime.utcnow()
            self.db.commit()
            return True
        return False
    
    def cleanup_expired_sessions(self):
        """Remove expired sessions"""
        expiry_time = datetime.utcnow() - timedelta(minutes=getattr(settings, 'session_timeout_minutes', 30))
        
        expired_sessions = self.db.query(UserSession).filter(
            and_(
                UserSession.last_activity < expiry_time,
                UserSession.is_active == True
            )
        ).all()
        
        for session in expired_sessions:
            session.is_active = False
        
        self.db.commit()
        return len(expired_sessions)
    
    def _session_to_dict(self, session: UserSession) -> Dict:
        """Convert session to dictionary"""
        return {
            "session_id": session.id,
            "device_info": session.device_info,
            "ip_address": session.ip_address,
            "created_at": session.created_at.isoformat(),
            "last_activity": session.last_activity.isoformat(),
            "is_current": False
        }