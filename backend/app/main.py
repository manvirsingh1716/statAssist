import logging
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.api.routes import auth, data, model, system
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.base import Base
from app.db.session import engine
from app.models import User  # noqa: F401


configure_logging(settings.log_level)
app = FastAPI(title=settings.app_name)
logger = logging.getLogger(__name__)


@app.on_event("startup")
def init_database() -> None:
    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError as exc:
            if attempt == max_attempts:
                raise RuntimeError("Database initialization failed after retries.") from exc
            logger.warning("Database not ready (attempt %s/%s). Retrying...", attempt, max_attempts)
            time.sleep(2)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Data Science Dashboard backend is running."}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(data.router, prefix=settings.api_prefix)
app.include_router(model.router, prefix=settings.api_prefix)
app.include_router(system.router, prefix=settings.api_prefix)