from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./auth_app.db"
    redis_url: str = "redis://localhost:6379/0"
    
    # Auth0 Configuration
    auth0_domain: str = ""
    auth0_audience: str = ""
    auth0_client_id: str = ""
    auth0_client_secret: str = ""
    
    # Application
    secret_key: str = "default-secret-key"
    MAX_DEVICES_PER_USER: int = 3
    session_timeout_minutes: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()