from io import StringIO
from typing import Any

import numpy as np
import pandas as pd
from fastapi import HTTPException, UploadFile

from app.schemas.data_schema import MissingStrategy


def parse_csv_upload(file: UploadFile) -> pd.DataFrame:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    raw_content = file.file.read()
    if not raw_content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        decoded = raw_content.decode("utf-8")
        dataframe = pd.read_csv(StringIO(decoded))
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="CSV file must be UTF-8 encoded.") from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not parse CSV file.") from exc

    if dataframe.empty:
        raise HTTPException(status_code=400, detail="CSV has no rows.")

    return dataframe


def get_basic_stats(dataframe: pd.DataFrame) -> dict[str, dict[str, float | None]]:
    numeric_df = dataframe.select_dtypes(include=[np.number])
    stats: dict[str, dict[str, float | None]] = {}

    for column in numeric_df.columns:
        series = numeric_df[column].dropna()
        if series.empty:
            stats[column] = {
                "mean": None,
                "median": None,
                "min": None,
                "max": None,
                "std": None,
            }
            continue

        stats[column] = {
            "mean": float(series.mean()),
            "median": float(series.median()),
            "min": float(series.min()),
            "max": float(series.max()),
            "std": float(series.std(ddof=0)),
        }

    return stats


def sanitize_records(dataframe: pd.DataFrame, limit: int = 10) -> list[dict[str, Any]]:
    records = dataframe.head(limit).replace({np.nan: None}).to_dict(orient="records")
    return records


def build_preview_payload(dataset_id: str, dataframe: pd.DataFrame) -> dict[str, Any]:
    numeric_columns = dataframe.select_dtypes(include=[np.number]).columns.tolist()
    return {
        "dataset_id": dataset_id,
        "columns": dataframe.columns.tolist(),
        "numeric_columns": numeric_columns,
        "row_count": int(len(dataframe)),
        "preview": sanitize_records(dataframe, limit=12),
        "basic_stats": get_basic_stats(dataframe),
    }


def process_dataframe(
    dataframe: pd.DataFrame,
    selected_columns: list[str] | None,
    missing_strategy: MissingStrategy,
    normalize: bool,
) -> pd.DataFrame:
    processed = dataframe.copy()

    if selected_columns:
        invalid_columns = [column for column in selected_columns if column not in processed.columns]
        if invalid_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid columns requested: {', '.join(invalid_columns)}",
            )
        processed = processed[selected_columns]

    if missing_strategy == "drop":
        processed = processed.dropna()
    else:
        numeric_columns = processed.select_dtypes(include=[np.number]).columns.tolist()
        object_columns = [col for col in processed.columns if col not in numeric_columns]

        if missing_strategy == "mean":
            for column in numeric_columns:
                processed[column] = processed[column].fillna(processed[column].mean())
        elif missing_strategy == "median":
            for column in numeric_columns:
                processed[column] = processed[column].fillna(processed[column].median())
        elif missing_strategy == "zero":
            for column in numeric_columns:
                processed[column] = processed[column].fillna(0)

        for column in object_columns:
            mode = processed[column].mode()
            fallback_value = mode.iloc[0] if not mode.empty else "unknown"
            processed[column] = processed[column].fillna(fallback_value)

    if normalize:
        numeric_columns = processed.select_dtypes(include=[np.number]).columns.tolist()
        for column in numeric_columns:
            col_min = processed[column].min()
            col_max = processed[column].max()
            if pd.isna(col_min) or pd.isna(col_max) or col_min == col_max:
                processed[column] = 0.0
            else:
                processed[column] = (processed[column] - col_min) / (col_max - col_min)

    if processed.empty:
        raise HTTPException(
            status_code=400,
            detail="No rows remain after processing. Try a different strategy.",
        )

    return processed


def build_visualization_data(
    dataset_id: str,
    dataframe: pd.DataFrame,
    x_axis: str | None,
    series_columns: list[str] | None,
) -> dict[str, Any]:
    columns = dataframe.columns.tolist()

    if not columns:
        raise HTTPException(status_code=400, detail="Dataset has no columns.")

    selected_x = x_axis if x_axis in columns else columns[0]

    numeric_columns = dataframe.select_dtypes(include=[np.number]).columns.tolist()
    fallback_series = [column for column in numeric_columns if column != selected_x][:2]
    selected_series = series_columns or fallback_series

    selected_series = [column for column in selected_series if column in columns and column != selected_x]
    if not selected_series:
        raise HTTPException(
            status_code=400,
            detail="No valid series columns available for visualization.",
        )

    chart_df = dataframe[[selected_x, *selected_series]].head(100).replace({np.nan: None})

    return {
        "dataset_id": dataset_id,
        "x_axis": selected_x,
        "series_columns": selected_series,
        "points": chart_df.to_dict(orient="records"),
    }
