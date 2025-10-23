import axios, { AxiosError } from 'axios'
import { env } from '@/lib/env'
import type {
  IngestResponse,
  TransformRequest,
  TransformResponse,
  ApiError,
} from '@/types'

/**
 * Axios instance configured with base URL
 */
const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Handles API errors and returns structured error object
 */
function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>

    if (axiosError.response) {
      const { status, data } = axiosError.response

      // Map common HTTP errors to user-friendly messages
      switch (status) {
        case 415:
          return {
            error: 'Solo se permiten archivos CSV y XLSX',
            detail: data.detail,
            status,
          }
        case 413:
          return {
            error: 'Tu archivo excede el límite permitido',
            detail: data.detail,
            status,
          }
        case 422:
          return {
            error: 'Faltan campos requeridos o datos inválidos',
            detail: data.detail || 'Verifica el archivo y las credenciales del agente',
            status,
          }
        case 500:
        case 502:
        case 503:
          return {
            error: 'Error al invocar la IA. Intenta más tarde',
            detail: data.detail,
            status,
          }
        default:
          return {
            error: data.error || 'Error desconocido',
            detail: data.detail,
            status,
          }
      }
    }

    if (axiosError.request) {
      return {
        error: 'No se pudo conectar con el servidor',
        detail: 'Verifica tu conexión a internet',
        status: 0,
      }
    }
  }

  return {
    error: 'Error inesperado',
    detail: error instanceof Error ? error.message : String(error),
    status: 0,
  }
}

/**
 * Sends file and prompt to AI for analysis
 * @param message - User's description/prompt
 * @param file - CSV or XLSX file
 * @returns Ingest response with session ID and suggested charts
 * @throws ApiError on failure
 */
export async function ingestData(
  message: string,
  file: File
): Promise<IngestResponse> {
  try {
    const formData = new FormData()
    formData.append('message', message)
    formData.append('file', file)
    formData.append('agent_id', env.agentId)
    formData.append('agent_alias_id', env.agentAliasId)

    const response = await api.post<IngestResponse>('/ingest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Transforms selected charts into built charts with data
 * @param request - Session ID and selected charts
 * @returns Transform response with built charts
 * @throws ApiError on failure
 */
export async function transformCharts(
  request: TransformRequest
): Promise<TransformResponse> {
  try {
    const response = await api.post<TransformResponse>('/charts/transform', request)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}
