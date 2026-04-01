import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { getModelResult } from '../utils/storage'

export function ResultsPage() {
  const result = getModelResult()

  if (!result) {
    return (
      <section className="page-content">
        <header className="page-header">
          <h2>Results</h2>
          <p className="muted">Train a model first to view performance metrics and predictions.</p>
        </header>
      </section>
    )
  }

  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Model Results</h2>
        <p className="muted">Linear regression summary and actual vs predicted comparison.</p>
      </header>

      <div className="panel-grid">
        <article className="panel card-like">
          <h3>Model Summary</h3>
          <p>Target: {result.target_column}</p>
          <p>R2 Score: {result.r2_score.toFixed(4)}</p>
          <p>Intercept: {result.intercept.toFixed(4)}</p>
          <h4>Coefficients</h4>
          <ul className="coefficient-list">
            {Object.entries(result.coefficients).map(([feature, coefficient]) => (
              <li key={feature}>
                <strong>{feature}:</strong> {coefficient.toFixed(4)}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel card-like wide-panel">
          <h3>Actual vs Predicted</h3>
          <div className="chart-wrap">
            <ResponsiveContainer height={320} width="100%">
              <LineChart data={result.predictions}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="actual" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="actual" name="Actual" stroke="#0c7489" strokeWidth={2} type="monotone" />
                <Line
                  dataKey="predicted"
                  name="Predicted"
                  stroke="#d95d39"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}
