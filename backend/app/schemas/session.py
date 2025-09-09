from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DeviceInfo(BaseModel):
    user_agent: str
    device_type: str  # mobile, tablet, desktop
    browser: str
    operating_system: str
    accept_language: str
    ip_address: str

class SessionData(BaseModel):
    session_id: str
    user_id: str
    device_info: DeviceInfo
    ip_address: str
    created_at: datetime
    last_activity: datetime
    is_active: bool = True

class SessionResponse(BaseModel):
    session_id: str
    device_info: DeviceInfo
    ip_address: str
    created_at: datetime
    last_activity: datetime
    is_current: bool = False

class SessionCreate(BaseModel):
    device_fingerprint: Optional[str] = None