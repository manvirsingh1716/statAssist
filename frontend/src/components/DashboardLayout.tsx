import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { WorkflowProgress } from './WorkflowProgress'
import { getActiveWorkflowStep } from '../config/workflow'
import { useAuth } from '../hooks/useAuth'

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const activeStep = getActiveWorkflowStep(location.pathname)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      <main className="page-shell">
        <header className="workspace-header card-like">
          <div>
            <p className="workspace-kicker">Current Stage</p>
            <h2>{activeStep.title}</h2>
            <p className="muted">{activeStep.objective}</p>
          </div>
          <div className="workspace-meta">
            <p className="muted">Signed in as</p>
            <strong>{user?.email ?? 'unknown user'}</strong>
          </div>
        </header>
        <WorkflowProgress activePath={location.pathname} />
        <Outlet />
      </main>
    </div>
  )
}
