from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user profile"""
    return UserResponse(
        id=current_user.id,
        auth0_user_id=current_user.auth0_user_id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone_number=current_user.phone_number,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current authenticated user profile"""
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.phone_number is not None:
        current_user.phone_number = user_update.phone_number
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        auth0_user_id=current_user.auth0_user_id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone_number=current_user.phone_number,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )