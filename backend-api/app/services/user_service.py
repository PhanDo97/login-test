from sqlalchemy.orm import Session
from app.models.user_sql import UserSQL
from app.core.database import SessionLocal
from typing import Optional

def get_user_by_username(db: Session, username: str) -> Optional[UserSQL]:
    return db.query(UserSQL).filter(UserSQL.username == username).first()
