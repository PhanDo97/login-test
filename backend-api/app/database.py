from sqlalchemy import create_engine
from app.models.user_sql import Base
from app.core.config import settings 

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)

def create_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_db()