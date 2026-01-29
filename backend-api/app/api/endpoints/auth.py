from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, TokenVerifyResponse
from sqlalchemy.orm import Session
from app.services.auth_service import AuthService
from app.core.security import verify_token
from app.core.database import SessionLocal

router = APIRouter()

# Dependency to get DB session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/register", response_model=LoginResponse, summary="User register")
async def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Endpoint Register
    Returns access token if successful
    """
    try:
        user = AuthService.create_user(
            db,
            username=register_data.username,
            email=register_data.email,
            password=register_data.password
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    access_token = AuthService.create_user_token(user)

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
        email=user.email
    )
@router.post("/login", response_model=LoginResponse, summary="User login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint Login
    Returns access token if successful
    """
    # Authenticate user
    user = AuthService.authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = AuthService.create_user_token(user)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
        email=user.email
    )

@router.get("/verify", response_model=TokenVerifyResponse, summary="Verify token")
async def verify_user_token(token: str = Query(..., description="JWT token to verify"), db: Session = Depends(get_db)):
    """
    Endpoint to verify JWT token
    Returns user information if the token is valid
    """
    # Verify token
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    username = payload.get("sub")
    email = payload.get("email")
    
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid",
        )
    
    # Check if user exists
    user = AuthService.get_user(db,username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User does not exist",
        )
    
    return TokenVerifyResponse(
        valid=True,
        username=user.username,
        email=user.email
    )

@router.get("/me", summary="Get current user information")
async def get_current_user(token: str = Query(..., description="JWT token"), db: Session = Depends(get_db)):
    """
    Endpoint to get information of the currently logged-in user
    """
    # Verify token
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or has expired",
        )
    
    username = payload.get("sub")
    user = AuthService.get_user(db, username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist",
        )
    
    return {
        "username": user.username,
        "email": user.email,
        "is_active": user.is_active
    }
