import type { TrainModelResponse, UserSession } from '../types'

const SESSION_KEY = 'ds_dashboard_session'
const DATASET_KEY = 'ds_dashboard_dataset_id'
const MODEL_RESULT_KEY = 'ds_dashboard_model_result'

export function getSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as UserSession
  } catch {
    return null
  }
}

export function setSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getDatasetId(): string | null {
  return localStorage.getItem(DATASET_KEY)
}

export function setDatasetId(datasetId: string): void {
  localStorage.setItem(DATASET_KEY, datasetId)
}

export function getModelResult(): TrainModelResponse | null {
  const raw = localStorage.getItem(MODEL_RESULT_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as TrainModelResponse
  } catch {
    return null
  }
}

export function setModelResult(result: TrainModelResponse): void {
  localStorage.setItem(MODEL_RESULT_KEY, JSON.stringify(result))
}
