from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    return {"status": "healthy", "service": "auth-api"}

@router.get("/db")
async def database_health(db = Depends(get_db)):
    try:
        # Simple DB query to test connection
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}