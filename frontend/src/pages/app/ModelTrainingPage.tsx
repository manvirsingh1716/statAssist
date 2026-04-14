import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Feedback } from '../../components/Feedback'
import { apiService } from '../../services/api'
import type { DataPreviewResponse } from '../../types'
import { getDatasetId, setDatasetId, setModelResult } from '../../utils/storage'

export function ModelTrainingPage() {
  const navigate = useNavigate()
  const [dataset, setDataset] = useState<DataPreviewResponse | null>(null)
  const [targetColumn, setTargetColumn] = useState('')
  const [featureColumns, setFeatureColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCurrent = async () => {
      setLoading(true)
      setError(null)

      try {
        const current = await apiService.getCurrentDataset(getDatasetId() ?? undefined)
        setDataset(current)
        setDatasetId(current.dataset_id)

        const defaultTarget = current.numeric_columns.at(-1) ?? current.columns.at(-1) ?? ''
        const defaultFeatures = current.numeric_columns.filter((column) => column !== defaultTarget)

        setTargetColumn(defaultTarget)
        setFeatureColumns(defaultFeatures)
      } catch {
        setError('Failed to load dataset')
      } finally {
        setLoading(false)
      }
    }

    void loadCurrent()
  }, [])

  const handleFeatureToggle = (column: string) => {
    setFeatureColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((item) => item !== column)
        : [...prevColumns, column],
    )
  }

  const handleTargetChange = (value: string) => {
    setTargetColumn(value)
    setFeatureColumns((prevColumns) => prevColumns.filter((column) => column !== value))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dataset || !targetColumn) {
      setError('Select a target column first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await apiService.trainLinearRegression({
        dataset_id: dataset.dataset_id,
        target_column: targetColumn,
        feature_columns: featureColumns,
        test_size: 0.2,
        random_state: 42,
      })
      setModelResult(result)
      navigate('/app/results')
    } catch {
      setError('Model training failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Model Training</h2>
        <p className="muted">Configure target and features to train a reliable linear regression baseline.</p>
      </header>

      <Feedback error={error} loading={loading} />

      {dataset && (
        <div className="panel-grid">
          <article className="panel card-like highlight-card">
            <h3>Training Setup</h3>
            <p><strong>Dataset:</strong> {dataset.dataset_id}</p>
            <p><strong>Target:</strong> {targetColumn || 'Not selected'}</p>
            <p><strong>Features:</strong> {featureColumns.length}</p>
            <p><strong>Model Type:</strong> Linear Regression</p>
          </article>

          <article className="panel card-like wide-panel">
            <form className="stacked-form" onSubmit={handleSubmit}>
              <label>
                Target Column
                <select onChange={(event) => handleTargetChange(event.target.value)} value={targetColumn}>
                  {dataset.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="form-label">Feature Columns</p>
                <div className="column-grid">
                  {dataset.columns
                    .filter((column) => column !== targetColumn)
                    .map((column) => (
                      <label className="inline-option" key={column}>
                        <input
                          checked={featureColumns.includes(column)}
                          onChange={() => handleFeatureToggle(column)}
                          type="checkbox"
                        />
                        {column}
                      </label>
                    ))}
                </div>
              </div>

              <button disabled={loading || featureColumns.length === 0} type="submit">
                Train Linear Regression
              </button>
            </form>
          </article>
        </div>
      )}
    </section>
  )
}
