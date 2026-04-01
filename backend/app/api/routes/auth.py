import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.data_schema import AuthRequest, AuthResponse, GoogleAuthRequest
from app.services.auth_service import generate_unusable_password, get_user_by_email, hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register_user(payload: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()

    return AuthResponse(
        message="User registered successfully.",
        user={"email": payload.email},
        token=secrets.token_urlsafe(32),
    )


@router.post("/login", response_model=AuthResponse)
def login_user(payload: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    return AuthResponse(
        message="Login successful.",
        user={"email": payload.email},
        token=secrets.token_urlsafe(32),
    )


@router.post("/google", response_model=AuthResponse)
def login_with_google(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    if not settings.google_client_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google login is not configured.")

    try:
        token_payload = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.google_client_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token.") from exc

    if not token_payload.get("email_verified", False):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google email is not verified.")

    email = token_payload.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google token missing email.")

    user = get_user_by_email(db, email)
    if not user:
        user = User(email=email, password_hash=hash_password(generate_unusable_password()))
        db.add(user)
        db.commit()

    return AuthResponse(
        message="Google login successful.",
        user={"email": email},
        token=secrets.token_urlsafe(32),
    )


@router.post("/logout")
def logout_user() -> dict[str, str]:
    return {"message": "Logout successful."}
