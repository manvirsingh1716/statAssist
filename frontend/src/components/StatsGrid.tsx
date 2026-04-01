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
          <p>Mean: {formatMetric(value.mean)}</p>
          <p>Median: {formatMetric(value.median)}</p>
          <p>Min: {formatMetric(value.min)}</p>
          <p>Max: {formatMetric(value.max)}</p>
          <p>Std: {formatMetric(value.std)}</p>
        </article>
      ))}
    </div>
  )
}
