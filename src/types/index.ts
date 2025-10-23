/**
 * Chart types supported by the application
 */
export type ChartKind =
  | 'line'
  | 'bar'
  | 'ara'
  | 'pie'
  | 'scatter'
  | 'donut'
  | 'histogram'
  | 'box'
  | 'hastmap'
  | 'treamp'

/**
 * Priority levels for suggested charts
 */
export type Priority = 'low' | 'medium' | 'high'

/**
 * Workspace status throughout the workflow
 */
export type WorkspaceStatus =
  | 'empty'
  | 'prompted'
  | 'selecting'
  | 'building'
  | 'ready'
  | 'error'

/**
 * Chart suggested by AI after ingest
 */
export interface SuggestedChart {
  title: string
  chart_type: ChartKind
  parameters?: Record<string, unknown>
  insight?: string
  priority?: Priority
}

/**
 * Built chart with complete configuration and data
 */
export interface ChartBuilt {
  id: string
  title: string
  chart_type: ChartKind
  chart_config: Record<string, unknown>
  chart_data: Record<string, unknown>[]
  x_axis_key?: string
  y_axis_keys?: string[]
  description?: string
}

/**
 * Workspace containing charts and state
 */
export interface Workspace {
  id: string
  name: string
  status: WorkspaceStatus
  sessionId?: string
  dataset?: Record<string, unknown>[]
  selected?: SuggestedChart[]
  charts?: ChartBuilt[]
  createdAt: number
  updatedAt: number
}

/**
 * Response from POST /api/v1/ingest
 */
export interface IngestResponse {
  message: string
  session_id: string
  columns: string[]
  dtypes: Record<string, string>
  summary: {
    describe_numeric?: Record<string, unknown>
    describe_non_numeric?: Record<string, unknown>
    info_text?: string
  }
  sent_to_agent: boolean
  chart_transform_request: {
    session_id: string
    suggested_charts: SuggestedChart[]
    dataset: Record<string, unknown>[]
  }
  agent_reply: string | null
}

/**
 * Request body for POST /api/v1/charts/transform
 */
export interface TransformRequest {
  session_id: string
  suggested_charts: SuggestedChart[]
  dataset: Record<string, unknown>[]
}

/**
 * Response from POST /api/v1/charts/transform
 */
export interface TransformResponse {
  message: string
  session_id: string
  charts: ChartBuilt[]
  total_charts: number
}

/**
 * API error response structure
 */
export interface ApiError {
  error: string
  detail?: string
  status: number
}
