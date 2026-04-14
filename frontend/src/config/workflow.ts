export interface WorkflowStep {
  id: string
  title: string
  to: string
  shortLabel: string
  objective: string
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'overview',
    title: 'Dashboard',
    to: '/app',
    shortLabel: 'Dashboard',
    objective: 'Understand what this dataset contains and what question to solve.',
  },
  {
    id: 'import',
    title: 'Import Data',
    to: '/app/data-upload',
    shortLabel: 'Import',
    objective: 'Upload CSV data and inspect shape, schema, and sample rows.',
  },
  {
    id: 'prepare',
    title: 'Prepare Data',
    to: '/app/data-processing',
    shortLabel: 'Prepare',
    objective: 'Fix missing data, select columns, and normalize signals.',
  },
  {
    id: 'train',
    title: 'Train Model',
    to: '/app/model-training',
    shortLabel: 'Train',
    objective: 'Choose target/features and train a baseline model.',
  },
  {
    id: 'explain',
    title: 'Explain Results',
    to: '/app/results',
    shortLabel: 'Explain',
    objective: 'Review metrics and compare predictions against actual outcomes.',
  },
]

export function getActiveWorkflowStep(pathname: string): WorkflowStep {
  return WORKFLOW_STEPS.find((step) => step.to === pathname) ?? WORKFLOW_STEPS[0]
}
