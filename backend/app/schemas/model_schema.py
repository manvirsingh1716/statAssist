from pydantic import BaseModel, Field


class TrainModelRequest(BaseModel):
    dataset_id: str | None = None
    target_column: str
    feature_columns: list[str] | None = None
    test_size: float = Field(default=0.2, gt=0, lt=0.9)
    random_state: int = 42


class PredictionPoint(BaseModel):
    actual: float
    predicted: float


class TrainModelResponse(BaseModel):
    dataset_id: str
    target_column: str
    feature_columns: list[str]
    coefficients: dict[str, float]
    intercept: float
    r2_score: float
    predictions: list[PredictionPoint]
