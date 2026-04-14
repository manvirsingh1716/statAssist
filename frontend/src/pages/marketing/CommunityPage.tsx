const COMMUNITY_RESOURCES = [
  {
    title: 'GitHub Repository',
    description: 'Contribute improvements, open issues, and collaborate on roadmap items.',
  },
  {
    title: 'Discord Community',
    description: 'Discuss workflows, request features, and get help from peers and maintainers.',
  },
  {
    title: 'Help and Documentation',
    description: 'Access onboarding guides, practical examples, and troubleshooting resources.',
  },
]

export function CommunityPage() {
  return (
    <section className="marketing-page">
      <header className="marketing-section-header card-like">
        <p className="marketing-eyebrow">Community</p>
        <h1>Built with the Community, for the Community</h1>
        <p className="muted">NoCodeML grows through open collaboration and practical support channels.</p>
      </header>

      <div className="marketing-grid">
        {COMMUNITY_RESOURCES.map((resource) => (
          <article className="card-like marketing-card" key={resource.title}>
            <h3>{resource.title}</h3>
            <p className="muted">{resource.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
