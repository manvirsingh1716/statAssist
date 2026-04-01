from typing import Any

import numpy as np
import pandas as pd
from fastapi import HTTPException
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split


def _resolve_features(
    dataframe: pd.DataFrame,
    target_column: str,
    feature_columns: list[str] | None,
) -> list[str]:
    if target_column not in dataframe.columns:
        raise HTTPException(status_code=400, detail="Target column not found in dataset.")

    if feature_columns:
        invalid_columns = [column for column in feature_columns if column not in dataframe.columns]
        if invalid_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid feature columns: {', '.join(invalid_columns)}",
            )
        resolved = [column for column in feature_columns if column != target_column]
    else:
        numeric_columns = dataframe.select_dtypes(include=[np.number]).columns.tolist()
        resolved = [column for column in numeric_columns if column != target_column]

    if not resolved:
        raise HTTPException(status_code=400, detail="No valid feature columns available.")

    return resolved


def train_linear_regression(
    dataset_id: str,
    dataframe: pd.DataFrame,
    target_column: str,
    feature_columns: list[str] | None,
    test_size: float,
    random_state: int,
) -> dict[str, Any]:
    resolved_features = _resolve_features(dataframe, target_column, feature_columns)

    modeling_df = dataframe[[*resolved_features, target_column]].apply(pd.to_numeric, errors="coerce").dropna()

    if len(modeling_df) < 3:
        raise HTTPException(
            status_code=400,
            detail="Not enough valid numeric rows to train a model.",
        )

    x_data = modeling_df[resolved_features]
    y_data = modeling_df[target_column]

    if len(modeling_df) >= 5:
        x_train, x_test, y_train, y_test = train_test_split(
            x_data,
            y_data,
            test_size=test_size,
            random_state=random_state,
        )
    else:
        x_train, y_train = x_data, y_data
        x_test, y_test = x_data, y_data

    model = LinearRegression()
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)

    try:
        score = float(r2_score(y_test, predictions))
    except ValueError:
        score = 0.0

    prediction_points = [
        {"actual": float(actual), "predicted": float(predicted)}
        for actual, predicted in zip(y_test.tolist(), predictions.tolist())
    ]

    return {
        "dataset_id": dataset_id,
        "target_column": target_column,
        "feature_columns": resolved_features,
        "coefficients": {
            feature: float(coef) for feature, coef in zip(resolved_features, model.coef_.tolist())
        },
        "intercept": float(model.intercept_),
        "r2_score": score,
        "predictions": prediction_points,
    }
