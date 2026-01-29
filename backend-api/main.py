from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth
from app.core.config import settings
import uvicorn
import os
from app.core.config import settings

print("Current working directory:", os.getcwd())
print("DATABASE_URL:", settings.DATABASE_URL)
print("Database file exists:", os.path.exists(settings.DATABASE_URL.replace("sqlite:///", "")))
# ...existing code...
app = FastAPI()

# CORS setting
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Login System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
