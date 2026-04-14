import { Link } from 'react-router-dom'

const HIGHLIGHTS = [
  {
    title: 'No-Code Pipeline',
    description: 'Upload, process, train, and evaluate models using guided steps without writing code.',
  },
  {
    title: 'Community-Supported',
    description: 'Built for learners, startups, and teams who need practical ML workflows with transparent tooling.',
  },
  {
    title: 'Free to Use',
    description: 'Start with a full workflow today and grow into advanced capabilities as your projects mature.',
  },
]

export function LandingPage() {
  return (
    <section className="marketing-page">
      <article className="marketing-hero card-like">
        <p className="marketing-eyebrow">NoCodeML Platform</p>
        <h1>Machine Learning Workflows for Everyone</h1>
        <p>
          Transform raw CSV data into trained models and actionable insights inside a professional, guided workspace.
        </p>
        <div className="marketing-cta-row">
          <Link className="button-link" to="/register">
            Create Free Account
          </Link>
          <Link className="marketing-link" to="/features">
            Explore Features
          </Link>
        </div>
      </article>

      <div className="marketing-grid">
        {HIGHLIGHTS.map((item) => (
          <article className="card-like marketing-card" key={item.title}>
            <h3>{item.title}</h3>
            <p className="muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
