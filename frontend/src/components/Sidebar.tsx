import { NavLink } from 'react-router-dom'

import { APP_SECTIONS } from '../config/appNavigation'

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-kicker">NoCodeML Studio</p>
        <h1 className="sidebar-title">Free, Community-Powered ML</h1>
        <p className="sidebar-subtitle">Build models from raw data without writing code.</p>
      </div>

      <nav className="sidebar-nav">
        {APP_SECTIONS.map((item, index) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
          >
            <span className="nav-step-index">{index + 1}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.objective}</small>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footnote">
        <p>Community-supported and free to use.</p>
      </div>

      <button className="ghost-button" onClick={onLogout} type="button">
        Sign Out
      </button>
    </aside>
  )
}
