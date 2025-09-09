from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """Get current user from session"""
    
    # Get user ID from request headers (sent by frontend)
    user_id = request.headers.get("x-user-id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticates, Only authenticated users are allowed"
        )
    
    # Get user from database
    user = db.query(User).filter(User.auth0_user_id == user_id).first()
    if not user:
        # Create user if doesn't exist
        user = User(
            auth0_user_id=user_id,
            email=request.headers.get("x-user-email", ""),
            full_name=request.headers.get("x-user-name", ""),
            phone_number=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user