from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/health")
def auth_health():
    """Auth service health check"""
    return {"status": "ok", "service": "auth"}