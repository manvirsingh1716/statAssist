import type {
  DataPreviewResponse,
  ProcessDataRequest,
  ProcessDataResponse,
  TrainModelRequest,
  TrainModelResponse,
  VisualizationResponse,
} from '../types'

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`
    try {
      const payload = (await response.json()) as { detail?: string }
      throw new ApiError(payload.detail ?? fallbackMessage, response.status)
    } catch {
      throw new ApiError(fallbackMessage, response.status)
    }
  }

  return (await response.json()) as T
}

export const apiService = {
  async register(email: string, password: string): Promise<{ token: string; user: { email: string } }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async login(email: string, password: string): Promise<{ token: string; user: { email: string } }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async loginWithGoogle(idToken: string): Promise<{ token: string; user: { email: string } }> {
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    })
  },

  async getCurrentDataset(datasetId?: string): Promise<DataPreviewResponse> {
    const query = datasetId ? `?dataset_id=${encodeURIComponent(datasetId)}` : ''
    return request(`/data/current${query}`)
  },

  async uploadDataset(file: File): Promise<DataPreviewResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/data/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const fallbackMessage = `Upload failed with status ${response.status}`
      try {
        const payload = (await response.json()) as { detail?: string }
        throw new ApiError(payload.detail ?? fallbackMessage, response.status)
      } catch {
        throw new ApiError(fallbackMessage, response.status)
      }
    }

    return (await response.json()) as DataPreviewResponse
  },

  async processDataset(payload: ProcessDataRequest): Promise<ProcessDataResponse> {
    return request('/data/process', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async getVisualization(
    datasetId?: string,
    xAxis?: string,
    seriesColumns?: string[],
  ): Promise<VisualizationResponse> {
    const params = new URLSearchParams()
    if (datasetId) {
      params.append('dataset_id', datasetId)
    }
    if (xAxis) {
      params.append('x_axis', xAxis)
    }
    if (seriesColumns?.length) {
      for (const column of seriesColumns) {
        params.append('series_columns', column)
      }
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return request(`/data/visualization${query}`)
  },

  async trainLinearRegression(payload: TrainModelRequest): Promise<TrainModelResponse> {
    return request('/model/train', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export { ApiError }
