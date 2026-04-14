const FEATURE_BLOCKS = [
  {
    title: 'Data Upload and Validation',
    description: 'Import CSV files, inspect schema, and verify data quality before modeling.',
  },
  {
    title: 'Guided Data Processing',
    description: 'Handle missing values, normalize fields, and choose feature columns in a clean workflow.',
  },
  {
    title: 'Model Training and Evaluation',
    description: 'Configure linear regression training and compare predicted outcomes with confidence metrics.',
  },
  {
    title: 'Operational Workspace',
    description: 'Track workflow progress, revisit project history, and manage settings in one environment.',
  },
]

export function FeaturesPage() {
  return (
    <section className="marketing-page">
      <header className="marketing-section-header card-like">
        <p className="marketing-eyebrow">Features</p>
        <h1>Everything Needed for No-Code ML Delivery</h1>
        <p className="muted">From data onboarding to results reporting, every stage is optimized for clarity and speed.</p>
      </header>

      <div className="marketing-grid">
        {FEATURE_BLOCKS.map((feature) => (
          <article className="card-like marketing-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p className="muted">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
