from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class UserSQL(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<UserSQL(username='{self.username}', email='{self.email}', is_active={self.is_active})>"