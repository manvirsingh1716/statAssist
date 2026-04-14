import { WORKFLOW_STEPS } from './workflow'

export interface AppSection {
  id: string
  title: string
  to: string
  objective: string
  isWorkflow: boolean
}

const WORKFLOW_SECTIONS: AppSection[] = WORKFLOW_STEPS.map((step) => ({
  id: step.id,
  title: step.title,
  to: step.to,
  objective: step.objective,
  isWorkflow: true,
}))

const MANAGEMENT_SECTIONS: AppSection[] = [
  {
    id: 'projects',
    title: 'Project History',
    to: '/app/projects',
    objective: 'Track previous model runs and revisit completed workspaces.',
    isWorkflow: false,
  },
  {
    id: 'settings',
    title: 'Account Settings',
    to: '/app/settings',
    objective: 'Manage profile details and workspace preferences.',
    isWorkflow: false,
  },
]

export const APP_SECTIONS: AppSection[] = [...WORKFLOW_SECTIONS, ...MANAGEMENT_SECTIONS]

export function getActiveAppSection(pathname: string): AppSection {
  return APP_SECTIONS.find((section) => section.to === pathname) ?? APP_SECTIONS[0]
}
