from pydantic import BaseModel

class RegisterRequest(BaseModel):
    """Schema for Register request"""
    username: str
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "password123"
            }
        }

class LoginRequest(BaseModel):
    """Schema for Login request"""
    username: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "password": "admin123"
            }
        }

class LoginResponse(BaseModel):
    """Schema for Login response"""
    access_token: str
    token_type: str
    username: str
    email: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "username": "admin",
                "email": "admin@example.com"
            }
        }

class UserResponse(BaseModel):
    """Schema for user information"""
    username: str
    email: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "email": "admin@example.com"
            }
        }

class TokenVerifyResponse(BaseModel):
    """Schema for token verification response"""
    valid: bool
    username: str
    email: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "valid": True,
                "username": "admin",
                "email": "admin@example.com"
            }
        }
