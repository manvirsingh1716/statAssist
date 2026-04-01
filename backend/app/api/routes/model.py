from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.state import InMemoryDataStore, get_data_store
from app.schemas.model_schema import TrainModelRequest, TrainModelResponse
from app.services.ml_models import train_linear_regression


router = APIRouter(prefix="/model", tags=["model"])


@router.post("/train", response_model=TrainModelResponse)
def train_model(
    payload: TrainModelRequest,
    store: InMemoryDataStore = Depends(get_data_store),
) -> TrainModelResponse:
    try:
        dataset_id, dataframe = store.get_dataset(payload.dataset_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Dataset not found.") from exc

    training_result = train_linear_regression(
        dataset_id=dataset_id,
        dataframe=dataframe,
        target_column=payload.target_column,
        feature_columns=payload.feature_columns,
        test_size=payload.test_size,
        random_state=payload.random_state,
    )

    return TrainModelResponse.model_validate(training_result)
