const PRICING_PLANS = [
  {
    name: 'Community Free',
    price: '$0',
    note: 'Available today',
    bullets: ['Full guided ML workflow', 'Project dashboard and results', 'Community support'],
  },
  {
    name: 'Pro (Planned)',
    price: 'Coming Soon',
    note: 'Future upgrade',
    bullets: ['Team collaboration controls', 'Advanced model options', 'Priority support and reporting'],
  },
]

export function PricingPage() {
  return (
    <section className="marketing-page">
      <header className="marketing-section-header card-like">
        <p className="marketing-eyebrow">Pricing</p>
        <h1>Start Free, Scale as You Grow</h1>
        <p className="muted">NoCodeML is free for the community today, with a future Pro tier for advanced team needs.</p>
      </header>

      <div className="marketing-grid">
        {PRICING_PLANS.map((plan) => (
          <article className="card-like marketing-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p className="pricing-value">{plan.price}</p>
            <p className="muted">{plan.note}</p>
            <ul className="feature-list">
              {plan.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
