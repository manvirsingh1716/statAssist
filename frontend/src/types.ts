export interface UserSession {
  email: string
  token: string
}

export interface BasicStatsRecord {
  mean: number | null
  median: number | null
  min: number | null
  max: number | null
  std: number | null
}

export interface DataPreviewResponse {
  dataset_id: string
  columns: string[]
  numeric_columns: string[]
  row_count: number
  preview: Record<string, string | number | null>[]
  basic_stats: Record<string, BasicStatsRecord>
}

export interface ProcessDataRequest {
  dataset_id?: string
  selected_columns?: string[]
  missing_strategy: 'drop' | 'mean' | 'median' | 'zero'
  normalize: boolean
}

export interface ProcessDataResponse {
  dataset_id: string
  columns: string[]
  row_count: number
  preview: Record<string, string | number | null>[]
  basic_stats: Record<string, BasicStatsRecord>
}

export interface VisualizationResponse {
  dataset_id: string
  x_axis: string
  series_columns: string[]
  points: Record<string, string | number | null>[]
}

export interface TrainModelRequest {
  dataset_id?: string
  target_column: string
  feature_columns?: string[]
  test_size: number
  random_state: number
}

export interface PredictionPoint {
  actual: number
  predicted: number
}

export interface TrainModelResponse {
  dataset_id: string
  target_column: string
  feature_columns: string[]
  coefficients: Record<string, number>
  intercept: number
  r2_score: number
  predictions: PredictionPoint[]
}
