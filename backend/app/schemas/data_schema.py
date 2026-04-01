from typing import Any, Literal

from pydantic import BaseModel, Field


MissingStrategy = Literal["drop", "mean", "median", "zero"]


class DataPreviewResponse(BaseModel):
    dataset_id: str
    columns: list[str]
    numeric_columns: list[str]
    row_count: int
    preview: list[dict[str, Any]]
    basic_stats: dict[str, dict[str, float | None]]


class ProcessDataRequest(BaseModel):
    dataset_id: str | None = None
    selected_columns: list[str] | None = None
    missing_strategy: MissingStrategy = "mean"
    normalize: bool = False


class ProcessDataResponse(BaseModel):
    dataset_id: str
    columns: list[str]
    row_count: int
    preview: list[dict[str, Any]]
    basic_stats: dict[str, dict[str, float | None]]


class VisualizationResponse(BaseModel):
    dataset_id: str
    x_axis: str
    series_columns: list[str]
    points: list[dict[str, float | int | str | None]]


class AuthRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=3)


class GoogleAuthRequest(BaseModel):
    id_token: str = Field(min_length=20)


class AuthResponse(BaseModel):
    message: str
    user: dict[str, str]
    token: str
