import { NavLink } from 'react-router-dom'

import { WORKFLOW_STEPS } from '../config/workflow'

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-kicker">ModelPath</p>
        <h1 className="sidebar-title">Guided ML Studio</h1>
      </div>

      <nav className="sidebar-nav">
        {WORKFLOW_STEPS.map((item) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            key={item.to}
            to={item.to}
            end={item.to === '/'}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>

      <button className="ghost-button" onClick={onLogout} type="button">
        Logout
      </button>
    </aside>
  )
}
