import { NavLink } from 'react-router-dom'

import { WORKFLOW_STEPS } from '../config/workflow'

interface WorkflowProgressProps {
  activePath: string
}

export function WorkflowProgress({ activePath }: WorkflowProgressProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex((step) => step.to === activePath)

  return (
    <ol className="workflow-progress" aria-label="ModelPath workflow progress">
      {WORKFLOW_STEPS.map((step, index) => {
        const isActive = step.to === activePath
        const isCompleted = currentIndex >= 0 && index < currentIndex

        return (
          <li className={`workflow-item ${isActive ? 'active' : ''} ${isCompleted ? 'done' : ''}`} key={step.id}>
            <NavLink className="workflow-link" to={step.to} end={step.to === '/'}>
              <span className="workflow-index">{index + 1}</span>
              <span>{step.shortLabel}</span>
            </NavLink>
          </li>
        )
      })}
    </ol>
  )
}
