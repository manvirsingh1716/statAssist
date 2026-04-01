from pathlib import Path

import pandas as pd


SAMPLE_DATASET_PATH = Path(__file__).resolve().parent.parent / "data" / "sample_dataset.csv"


def load_sample_dataset() -> pd.DataFrame:
    return pd.read_csv(SAMPLE_DATASET_PATH)
