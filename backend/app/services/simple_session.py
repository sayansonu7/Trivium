from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.user import User
from app.models.session import UserSession
import uuid
from datetime import datetime
import time

class SimpleSessionService:
    def __init__(self, db: Session):
        self.db = db
        self.max_devices = 3  # Fixed to 3 devices
    
    def create_session(self, user: User, device_info: str, ip_address: str, force_create: bool = False) -> Dict:
        """Create new session and check device limit"""
        
        # Clean up expired sessions first
        self._cleanup_expired_sessions(user.id)
        
        # Get ONLY active sessions
        active_sessions = self.get_active_sessions(user.id)
        
        print(f"User {user.id} has {len(active_sessions)} active sessions (force_create: {force_create})")
        
        # Check device limit - only if we actually have 3 or more sessions AND not force creating
        if len(active_sessions) >= self.max_devices and not force_create:
            print(f"Device limit exceeded for user {user.id}")
            return {
                "status": "device_limit_exceeded",
                "current_sessions": [self._session_to_dict(s) for s in active_sessions],
                "max_devices": self.max_devices
            }
        
        # Parse browser info from user agent
        browser_info = self._parse_browser_info(device_info)
        
        # Create new session with local timezone
        from datetime import timezone, timedelta
        
        # Assuming IST (UTC+5:30) - adjust as needed
        local_tz = timezone(timedelta(hours=5, minutes=30))
        current_time = datetime.now(local_tz)
        
        session = UserSession(
            user_id=user.id,
            session_token=str(uuid.uuid4()),
            device_info={
                "browser": browser_info["browser"],
                "os": browser_info["os"],
                "device_type": browser_info["device_type"]
            },
            device_fingerprint=f"{browser_info['browser']}_{browser_info['os']}_{time.time()}",
            ip_address=ip_address,
            is_active=True,
            created_at=current_time.replace(tzinfo=None),
            last_activity=current_time.replace(tzinfo=None)
        )
        
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        print(f"Created new session {session.id} for user {user.id}")
        
        return {
            "status": "success",
            "session_id": session.id
        }
    
    def get_active_sessions(self, user_id: int) -> List[UserSession]:
        """Get all active sessions for user"""
        sessions = self.db.query(UserSession).filter(
            and_(
                UserSession.user_id == user_id,
                UserSession.is_active == True
            )
        ).all()
        
        print(f"Found {len(sessions)} active sessions for user {user_id}")
        return sessions
    
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
            print(f"Terminated session {session_id}")
            return True
        return False
    
    def _cleanup_expired_sessions(self, user_id: int):
        """Remove sessions older than 24 hours"""
        from datetime import timedelta
        
        expiry_time = datetime.utcnow() - timedelta(hours=24)
        
        expired_sessions = self.db.query(UserSession).filter(
            and_(
                UserSession.user_id == user_id,
                UserSession.is_active == True,
                UserSession.last_activity < expiry_time
            )
        ).all()
        
        for session in expired_sessions:
            session.is_active = False
        
        if expired_sessions:
            self.db.commit()
            print(f"Cleaned up {len(expired_sessions)} expired sessions")
    
    def _parse_browser_info(self, user_agent: str) -> Dict:
        """Parse browser info from user agent"""
        ua_lower = user_agent.lower()
        
        # Determine browser
        if "chrome" in ua_lower and "edg" not in ua_lower:
            browser = "Chrome"
        elif "firefox" in ua_lower:
            browser = "Firefox"
        elif "safari" in ua_lower and "chrome" not in ua_lower:
            browser = "Safari"
        elif "edg" in ua_lower:
            browser = "Edge"
        else:
            browser = "Unknown Browser"
        
        # Determine OS
        if "windows" in ua_lower:
            os = "Windows"
        elif "mac" in ua_lower and "iphone" not in ua_lower:
            os = "macOS"
        elif "linux" in ua_lower:
            os = "Linux"
        elif "android" in ua_lower:
            os = "Android"
        elif "iphone" in ua_lower or "ios" in ua_lower:
            os = "iOS"
        else:
            os = "Unknown OS"
        
        # Determine device type
        if any(mobile in ua_lower for mobile in ["mobile", "android", "iphone"]):
            device_type = "Mobile"
        elif any(tablet in ua_lower for tablet in ["tablet", "ipad"]):
            device_type = "Tablet"
        else:
            device_type = "Desktop"
        
        return {
            "browser": browser,
            "os": os,
            "device_type": device_type
        }
    
    def _session_to_dict(self, session: UserSession) -> Dict:
        """Convert session to dictionary with clean display info"""
        device_info = session.device_info
        
        # Format timestamps in local timezone
        from datetime import timezone, timedelta
        local_tz = timezone(timedelta(hours=5, minutes=30))  # IST
        
        created_time = session.created_at if session.created_at else datetime.utcnow()
        activity_time = session.last_activity if session.last_activity else datetime.utcnow()
        
        return {
            "session_id": session.id,
            "device_info": {
                "browser": device_info.get("browser", "Unknown Browser"),
                "operating_system": device_info.get("os", "Unknown OS"),
                "device_type": device_info.get("device_type", "Desktop")
            },
            "ip_address": session.ip_address,
            "created_at": created_time.isoformat(),
            "last_activity": activity_time.isoformat()
        }