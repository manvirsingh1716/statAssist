from uuid import uuid4

import pandas as pd

from app.utils.sample_data import load_sample_dataset


class InMemoryDataStore:
    def __init__(self) -> None:
        self._datasets: dict[str, pd.DataFrame] = {}
        self._active_dataset_id: str | None = None
        self.seed_sample_dataset()

    def seed_sample_dataset(self) -> str:
        sample_df = load_sample_dataset()
        return self.set_dataset(sample_df)

    def set_dataset(self, dataframe: pd.DataFrame) -> str:
        dataset_id = uuid4().hex[:12]
        self._datasets[dataset_id] = dataframe.copy()
        self._active_dataset_id = dataset_id
        return dataset_id

    def get_dataset(self, dataset_id: str | None = None) -> tuple[str, pd.DataFrame]:
        resolved_id = dataset_id or self._active_dataset_id
        if not resolved_id or resolved_id not in self._datasets:
            raise KeyError("Dataset not found")

        return resolved_id, self._datasets[resolved_id].copy()


_data_store = InMemoryDataStore()


def get_data_store() -> InMemoryDataStore:
    return _data_store
