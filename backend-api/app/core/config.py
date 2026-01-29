from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "Login System API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
    ]
    
    # Security Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    DATABASE_URL : str = "sqlite:///./test.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
