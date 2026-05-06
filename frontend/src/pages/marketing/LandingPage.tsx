import { Link } from 'react-router-dom'

const HIGHLIGHTS = [
  {
    title: 'No-Code Pipeline',
    description: 'Upload, process, train, and evaluate models using guided steps without writing code. Seamlessly move from data to insights.',
  },
  {
    title: 'Enterprise-Grade Scale',
    description: 'Built for learners, startups, and teams who need practical ML workflows with transparent, enterprise-ready tooling.',
  },
  {
    title: 'Start Instantly',
    description: 'Start with a full workflow today and grow into advanced capabilities as your machine learning projects mature.',
  },
]

export function LandingPage() {
  return (
    <section className="marketing-page fade-in">
      <article className="marketing-hero card-like" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb" style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', zIndex: -1 }}></div>
        <p className="marketing-eyebrow" style={{ color: 'var(--brand)' }}>Vertex-Inspired NoCodeML Platform</p>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', textShadow: '0 0 20px rgba(255,255,255,0.2)', marginBottom: '1rem' }}>
          Machine Learning <br/>
          <span style={{ background: 'linear-gradient(to right, var(--brand), var(--brand-strong))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>Workflows for Everyone</span>
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
          Transform raw data into trained models and actionable insights inside a professional, high-performance workspace designed for speed and clarity.
        </p>
        <div className="marketing-cta-row">
          <Link className="button-link" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', boxShadow: 'var(--glow-strong)' }} to="/register">
            Start Building Free
          </Link>
          <Link className="button-link ghost-button" to="/features">
            Explore Capabilities
          </Link>
        </div>
      </article>

      <div className="marketing-grid">
        {HIGHLIGHTS.map((item) => (
          <article className="card-like marketing-card fade-in" key={item.title} style={{ animationDelay: '0.1s' }}>
            <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>{item.title}</h3>
            <p className="muted" style={{ lineHeight: '1.6' }}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
