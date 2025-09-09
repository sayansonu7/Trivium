from pydantic import BaseModel
from typing import Optional

class TokenPayload(BaseModel):
    sub: str  # Auth0 user ID
    email: Optional[str] = None
    name: Optional[str] = None
    aud: str  # Audience
    iss: str  # Issuer
    exp: int  # Expiration time
    iat: int  # Issued at time