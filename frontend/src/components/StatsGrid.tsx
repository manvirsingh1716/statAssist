import type { BasicStatsRecord } from '../types'

interface StatsGridProps {
  stats: Record<string, BasicStatsRecord>
}

function formatMetric(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return '-'
  }
  return value.toFixed(3)
}

export function StatsGrid({ stats }: StatsGridProps) {
  const entries = Object.entries(stats)

  if (!entries.length) {
    return <p className="muted">No numeric columns found for statistics.</p>
  }

  return (
    <div className="stats-grid">
      {entries.map(([column, value]) => (
        <article className="stat-card" key={column}>
          <h4>{column}</h4>
          <p>Mean: <strong>{formatMetric(value.mean)}</strong></p>
          <p>Median: <strong>{formatMetric(value.median)}</strong></p>
          <p>Min: <strong>{formatMetric(value.min)}</strong></p>
          <p>Max: <strong>{formatMetric(value.max)}</strong></p>
          <p>Std: <strong>{formatMetric(value.std)}</strong></p>
        </article>
      ))}
    </div>
  )
}
