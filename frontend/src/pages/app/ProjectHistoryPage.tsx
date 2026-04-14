const PROJECT_HISTORY = [
  {
    name: 'Customer Churn Baseline',
    updatedAt: 'Today',
    status: 'Completed',
    score: '0.8421 R2',
  },
  {
    name: 'Demand Forecast Iteration',
    updatedAt: 'Yesterday',
    status: 'In Progress',
    score: '-',
  },
]

export function ProjectHistoryPage() {
  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Project History</h2>
        <p className="muted">Review recent workspaces, statuses, and key model performance snapshots.</p>
      </header>

      <article className="card-like">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Top Metric</th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_HISTORY.map((project) => (
                <tr key={project.name}>
                  <td>{project.name}</td>
                  <td>{project.updatedAt}</td>
                  <td>{project.status}</td>
                  <td>{project.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
