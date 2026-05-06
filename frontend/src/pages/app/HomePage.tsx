import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'

import { Feedback } from '../../components/Feedback'
import { StatsGrid } from '../../components/StatsGrid'
import { apiService } from '../../services/api'
import type { DataPreviewResponse, VisualizationResponse } from '../../types'
import { getDatasetId, setDatasetId } from '../../utils/storage'

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
      } catch {
        setError('Failed to load dashboard data')
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
        <p className="muted">Monitor dataset health and move confidently through each model-building step.</p>
      </header>

      <Feedback error={error} loading={loading} />

      {!dataset && !loading && !error && (
        <article className="card-like empty-state">
          <h3>No active dataset yet</h3>
          <p className="muted">Upload a CSV file to begin your first ML workflow.</p>
          <Link className="button-link" to="/app/data-upload">
            Go to Data Upload
          </Link>
        </article>
      )}

      {dataset && (
        <div className="panel-grid">
          <article className="panel card-like highlight-card">
            <h3>Dataset Summary</h3>
            <p><strong>Dataset ID:</strong> {dataset.dataset_id}</p>
            <p><strong>Total Rows:</strong> {dataset.row_count}</p>
            <p><strong>Total Columns:</strong> {dataset.columns.length}</p>
            <p><strong>Numeric Signals:</strong> {dataset.numeric_columns.length}</p>
          </article>

          <article className="panel card-like">
            <h3>Workflow Readiness</h3>
            <p className="muted">Use this checklist to move from raw data to trained model quickly.</p>
            <ul className="feature-list">
              <li>Schema detected from uploaded dataset</li>
              <li>Statistics generated for numeric fields</li>
              <li>Visualization preview prepared</li>
              <li>Ready for processing and model training</li>
            </ul>
          </article>

          <article className="panel card-like wide-panel">
            <h3>Numeric Column Stats</h3>
            <StatsGrid stats={dataset.basic_stats} />
          </article>

          <article className="panel card-like wide-panel">
            <h3>Quick Visualization</h3>
            {chartData?.points.length ? (
              <div className="chart-wrap">
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={chartData.points}>
                    <CartesianGrid stroke="#334155" strokeDasharray="4 4" />
                    <XAxis dataKey={chartData.x_axis} stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} itemStyle={{ color: '#06b6d4' }} />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    {chartData.series_columns.map((column, index) => {
                      const colors = ['#06b6d4', '#a855f7', '#10b981', '#f43f5e', '#f59e0b'];
                      return <Line dataKey={column} key={column} stroke={colors[index % colors.length]} strokeWidth={3} type="monotone" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    })}
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
