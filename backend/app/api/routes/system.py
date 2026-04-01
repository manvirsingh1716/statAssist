from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_db


router = APIRouter(prefix="/system", tags=["system"])


@router.get("/health/live")
def liveness_probe() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
def readiness_probe(db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.") from exc

    return {"status": "ready"}
