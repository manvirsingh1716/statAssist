import { NavLink, Outlet } from 'react-router-dom'

const MARKETING_NAV = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Community', to: '/community' },
  { label: 'Security', to: '/security' },
]

export function MarketingLayout() {
  return (
    <div className="marketing-shell">
      <header className="marketing-header card-like">
        <NavLink className="marketing-brand" to="/">
          NoCodeML
        </NavLink>

        <nav className="marketing-nav" aria-label="Main navigation">
          {MARKETING_NAV.map((item) => (
            <NavLink
              className={({ isActive }) => `marketing-nav-link ${isActive ? 'active' : ''}`}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="marketing-actions">
          <NavLink className="marketing-link" to="/login">
            Login
          </NavLink>
          <NavLink className="button-link" to="/register">
            Get Started
          </NavLink>
        </div>
      </header>

      <main className="marketing-main">
        <Outlet />
      </main>

      <footer className="marketing-footer">
        <p>NoCodeML • Free and community-supported machine learning workflows</p>
      </footer>
    </div>
  )
}
