from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile

from app.dependencies.state import InMemoryDataStore, get_data_store
from app.schemas.data_schema import DataPreviewResponse, ProcessDataRequest, ProcessDataResponse, VisualizationResponse
from app.services.data_processing import (
    build_preview_payload,
    build_visualization_data,
    parse_csv_upload,
    process_dataframe,
    sanitize_records,
)


router = APIRouter(prefix="/data", tags=["data"])


@router.get("/current", response_model=DataPreviewResponse)
def get_current_dataset(
    dataset_id: str | None = None,
    store: InMemoryDataStore = Depends(get_data_store),
) -> DataPreviewResponse:
    try:
        resolved_id, dataframe = store.get_dataset(dataset_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Dataset not found.") from exc

    return DataPreviewResponse.model_validate(build_preview_payload(resolved_id, dataframe))


@router.post("/upload", response_model=DataPreviewResponse)
def upload_dataset(
    file: UploadFile = File(...),
    store: InMemoryDataStore = Depends(get_data_store),
) -> DataPreviewResponse:
    dataframe = parse_csv_upload(file)
    dataset_id = store.set_dataset(dataframe)
    _, stored_df = store.get_dataset(dataset_id)
    return DataPreviewResponse.model_validate(build_preview_payload(dataset_id, stored_df))


@router.post("/process", response_model=ProcessDataResponse)
def process_dataset(
    payload: ProcessDataRequest,
    store: InMemoryDataStore = Depends(get_data_store),
) -> ProcessDataResponse:
    try:
        _, dataframe = store.get_dataset(payload.dataset_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Dataset not found.") from exc

    processed_df = process_dataframe(
        dataframe=dataframe,
        selected_columns=payload.selected_columns,
        missing_strategy=payload.missing_strategy,
        normalize=payload.normalize,
    )

    dataset_id = store.set_dataset(processed_df)
    _, stored_df = store.get_dataset(dataset_id)

    return ProcessDataResponse.model_validate(
        {
            "dataset_id": dataset_id,
            "columns": stored_df.columns.tolist(),
            "row_count": int(len(stored_df)),
            "preview": sanitize_records(stored_df, limit=12),
            "basic_stats": build_preview_payload(dataset_id, stored_df)["basic_stats"],
        }
    )


@router.get("/visualization", response_model=VisualizationResponse)
def get_visualization_data(
    dataset_id: str | None = None,
    x_axis: str | None = None,
    series_columns: list[str] | None = Query(default=None),
    store: InMemoryDataStore = Depends(get_data_store),
) -> VisualizationResponse:
    try:
        resolved_id, dataframe = store.get_dataset(dataset_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Dataset not found.") from exc

    payload = build_visualization_data(
        dataset_id=resolved_id,
        dataframe=dataframe,
        x_axis=x_axis,
        series_columns=series_columns,
    )
    return VisualizationResponse.model_validate(payload)
