from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user - simplified for development"""
    
    # For development, create a test user
    test_user_id = "auth0|test123"
    
    user = db.query(User).filter(User.auth0_user_id == test_user_id).first()
    if not user:
        user = User(
            auth0_user_id=test_user_id,
            email="test@example.com",
            full_name="Test User",
            phone_number="123-456-7890"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user
