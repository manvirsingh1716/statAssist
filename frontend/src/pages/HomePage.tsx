import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Feedback } from '../components/Feedback'
import { StatsGrid } from '../components/StatsGrid'
import { apiService } from '../services/api'
import type { DataPreviewResponse, VisualizationResponse } from '../types'
import { getDatasetId, setDatasetId } from '../utils/storage'

export function HomePage() {
  const [dataset, setDataset] = useState<DataPreviewResponse | null>(null)
  const [chartData, setChartData] = useState<VisualizationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const preview = await apiService.getCurrentDataset(getDatasetId() ?? undefined)
        setDataset(preview)
        setDatasetId(preview.dataset_id)

        const visualization = await apiService.getVisualization(preview.dataset_id)
        setChartData(visualization)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Workspace Overview</h2>
        <p className="muted">Start here to understand your active dataset before moving into preparation and training.</p>
      </header>

      <Feedback error={error} loading={loading} />

      {dataset && (
        <div className="panel-grid">
          <article className="panel card-like">
            <h3>Dataset Summary</h3>
            <p>Dataset ID: {dataset.dataset_id}</p>
            <p>Total Rows: {dataset.row_count}</p>
            <p>Total Columns: {dataset.columns.length}</p>
          </article>

          <article className="panel card-like">
            <h3>Numeric Column Stats</h3>
            <StatsGrid stats={dataset.basic_stats} />
          </article>

          <article className="panel card-like wide-panel">
            <h3>Quick Visualization</h3>
            {chartData?.points.length ? (
              <div className="chart-wrap">
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={chartData.points}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey={chartData.x_axis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chartData.series_columns.map((column) => (
                      <Line dataKey={column} key={column} strokeWidth={2} type="monotone" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">No chartable series available in dataset.</p>
            )}
          </article>
        </div>
      )}
    </section>
  )
}
