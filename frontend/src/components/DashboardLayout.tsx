import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { WorkflowProgress } from './WorkflowProgress'
import { getActiveAppSection } from '../config/appNavigation'
import { WORKFLOW_STEPS } from '../config/workflow'
import { useAuth } from '../hooks/useAuth'

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const activeSection = getActiveAppSection(location.pathname)
  const activeStepIndex = WORKFLOW_STEPS.findIndex((step) => step.to === location.pathname)
  const isWorkflowSection = activeStepIndex >= 0

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      <main className="page-shell">
        <header className="workspace-header card-like workspace-header-enhanced">
          <div className="workspace-header-copy">
            <p className="workspace-kicker">Current Stage</p>
            <h2>{activeSection.title}</h2>
            <p className="muted">{activeSection.objective}</p>
            <p className="workspace-progress-note">
              {isWorkflowSection
                ? `Step ${activeStepIndex + 1} of ${WORKFLOW_STEPS.length} in your ML workflow`
                : 'Management section for account and project operations'}
            </p>
          </div>
          <div className="workspace-meta workspace-meta-enhanced">
            <p className="muted">Signed in as</p>
            <strong>{user?.email ?? 'unknown user'}</strong>
            <span className="status-badge">Workspace Active</span>
          </div>
        </header>
        {isWorkflowSection ? <WorkflowProgress activePath={location.pathname} /> : null}
        <Outlet />
      </main>
    </div>
  )
}
