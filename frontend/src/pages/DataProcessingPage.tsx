import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { DataTable } from '../components/DataTable'
import { Feedback } from '../components/Feedback'
import { apiService } from '../services/api'
import type { DataPreviewResponse } from '../types'
import { getDatasetId, setDatasetId } from '../utils/storage'

const MISSING_OPTIONS = [
  { label: 'Drop Rows', value: 'drop' },
  { label: 'Fill Mean', value: 'mean' },
  { label: 'Fill Median', value: 'median' },
  { label: 'Fill Zero', value: 'zero' },
] as const

export function DataProcessingPage() {
  const [dataset, setDataset] = useState<DataPreviewResponse | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [missingStrategy, setMissingStrategy] = useState<'drop' | 'mean' | 'median' | 'zero'>('mean')
  const [normalize, setNormalize] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCurrent = async () => {
      setLoading(true)
      try {
        const current = await apiService.getCurrentDataset(getDatasetId() ?? undefined)
        setDataset(current)
        setDatasetId(current.dataset_id)
        setSelectedColumns(current.columns)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dataset')
      } finally {
        setLoading(false)
      }
    }

    void loadCurrent()
  }, [])

  const handleToggleColumn = (column: string) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((item) => item !== column)
        : [...prevColumns, column],
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dataset) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.processDataset({
        dataset_id: dataset.dataset_id,
        selected_columns: selectedColumns,
        missing_strategy: missingStrategy,
        normalize,
      })

      const refreshed = await apiService.getCurrentDataset(response.dataset_id)
      setDataset(refreshed)
      setDatasetId(refreshed.dataset_id)
      setSelectedColumns(refreshed.columns)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Data Processing</h2>
        <p className="muted">Handle missing values, normalize numeric fields, and select feature columns.</p>
      </header>

      <Feedback error={error} loading={loading} />

      {dataset && (
        <div className="panel-grid">
          <article className="panel card-like">
            <h3>Processing Options</h3>
            <form className="stacked-form" onSubmit={handleSubmit}>
              <div>
                <p className="form-label">Missing Value Strategy</p>
                <select
                  onChange={(event) =>
                    setMissingStrategy(event.target.value as 'drop' | 'mean' | 'median' | 'zero')
                  }
                  value={missingStrategy}
                >
                  {MISSING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="inline-option">
                <input
                  checked={normalize}
                  onChange={(event) => setNormalize(event.target.checked)}
                  type="checkbox"
                />
                Normalize numeric columns
              </label>

              <div>
                <p className="form-label">Select Columns</p>
                <div className="column-grid">
                  {dataset.columns.map((column) => (
                    <label className="inline-option" key={column}>
                      <input
                        checked={selectedColumns.includes(column)}
                        onChange={() => handleToggleColumn(column)}
                        type="checkbox"
                      />
                      {column}
                    </label>
                  ))}
                </div>
              </div>

              <button disabled={loading || selectedColumns.length === 0} type="submit">
                Apply Processing
              </button>
            </form>
          </article>

          <article className="panel card-like wide-panel">
            <h3>Processed Preview</h3>
            <DataTable rows={dataset.preview} />
          </article>
        </div>
      )}
    </section>
  )
}
