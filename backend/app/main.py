from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, simple_sessions, session_check

app = FastAPI(title="Trivium API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(simple_sessions.router)
app.include_router(session_check.router)

@app.get("/")
def root():
    return {"message": "Trivium API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}