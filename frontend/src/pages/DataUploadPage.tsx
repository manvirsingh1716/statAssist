import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { DataTable } from '../components/DataTable'
import { Feedback } from '../components/Feedback'
import { StatsGrid } from '../components/StatsGrid'
import { apiService } from '../services/api'
import type { DataPreviewResponse, VisualizationResponse } from '../types'
import { getDatasetId, setDatasetId } from '../utils/storage'

export function DataUploadPage() {
  const [dataset, setDataset] = useState<DataPreviewResponse | null>(null)
  const [chartData, setChartData] = useState<VisualizationResponse | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const response = await apiService.getCurrentDataset(getDatasetId() ?? undefined)
        setDataset(response)
        setDatasetId(response.dataset_id)
        const visual = await apiService.getVisualization(response.dataset_id)
        setChartData(visual)
      } catch {
        // Page stays usable even when no dataset is resolved.
      }
    }

    void loadCurrent()
  }, [])

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file before uploading.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.uploadDataset(selectedFile)
      setDataset(response)
      setDatasetId(response.dataset_id)
      const visual = await apiService.getVisualization(response.dataset_id)
      setChartData(visual)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Data Upload</h2>
        <p className="muted">Upload CSV data to inspect schema, preview rows, and visualize columns.</p>
      </header>

      <article className="panel card-like">
        <div className="upload-row">
          <input accept=".csv" onChange={handleFileSelect} type="file" />
          <button disabled={loading || !selectedFile} onClick={handleUpload} type="button">
            Upload CSV
          </button>
        </div>
        <Feedback error={error} loading={loading} />
      </article>

      {dataset && (
        <div className="panel-grid">
          <article className="panel card-like">
            <h3>Preview ({dataset.row_count} rows)</h3>
            <DataTable rows={dataset.preview} />
          </article>

          <article className="panel card-like">
            <h3>Basic Statistics</h3>
            <StatsGrid stats={dataset.basic_stats} />
          </article>

          <article className="panel card-like wide-panel">
            <h3>Chart Preview</h3>
            {chartData?.points.length ? (
              <div className="chart-wrap">
                <ResponsiveContainer height={320} width="100%">
                  <BarChart data={chartData.points}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={chartData.x_axis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chartData.series_columns.map((column) => (
                      <Bar dataKey={column} key={column} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">No chart data to display.</p>
            )}
          </article>
        </div>
      )}
    </section>
  )
}
