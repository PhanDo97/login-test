from typing import Optional
from datetime import timedelta
from sqlalchemy.orm import Session
from app.models.user_sql import UserSQL
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings

class AuthService:
    """Service handling authentication logic"""

    @staticmethod
    def get_user(db: Session, username: str) -> Optional[UserSQL]:
        """Get user from database"""
        return db.query(UserSQL).filter(UserSQL.username == username).first()
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[UserSQL]:
        return db.query(UserSQL).filter(UserSQL.email == email).first()
    
    @staticmethod
    def create_user(db: Session, username: str, email: str, password: str) -> UserSQL:
        """
        Create new user in DB (register)
        - check duplicate username/email
        - hash password
        """
        if AuthService.get_user(db, username):
            raise ValueError("Username already exists")

        if AuthService.get_user_by_email(db, email):
            raise ValueError("Email already exists")

        hashed_password = get_password_hash(password)

        user = UserSQL(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_active=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[UserSQL]:
        """
        Authenticate user with username and password
        Return User object if successful, None if failed
        """
        user = AuthService.get_user(db, username)
        if not user:
            return None
        # check password (hashed)
        if not verify_password(password, user.hashed_password):
            return None
        # check if user is active
        if not user.is_active:
            return None
        
        return user
    
    @staticmethod
    def create_user_token(user: UserSQL) -> str:
        """Create JWT token for user"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "email": user.email},
            expires_delta=access_token_expires
        )
        return access_token
