import secrets

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.user import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def generate_unusable_password() -> str:
    return secrets.token_urlsafe(32)
