const SECURITY_PILLARS = [
  {
    title: 'Privacy by Design',
    description: 'User data handling follows clear boundaries and transparent processing behavior.',
  },
  {
    title: 'Account Protection',
    description: 'Authenticated access keeps workspaces scoped to signed-in users.',
  },
  {
    title: 'Transparent Governance',
    description: 'Community-first development encourages open discussion of trust and safety requirements.',
  },
]

export function SecurityPage() {
  return (
    <section className="marketing-page">
      <header className="marketing-section-header card-like">
        <p className="marketing-eyebrow">Security and Privacy</p>
        <h1>Designed for Trust and Clarity</h1>
        <p className="muted">We prioritize secure workflows and clear communication about data usage.</p>
      </header>

      <div className="marketing-grid">
        {SECURITY_PILLARS.map((pillar) => (
          <article className="card-like marketing-card" key={pillar.title}>
            <h3>{pillar.title}</h3>
            <p className="muted">{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
