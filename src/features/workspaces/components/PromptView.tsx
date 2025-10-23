import { useState } from 'react'
import { Upload, Sparkles } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { ingestData } from '@/services/api'
import type { ApiError } from '@/types'

interface PromptViewProps {
  workspaceId: string
}

/**
 * Prompt view for file upload and AI analysis
 */
export function PromptView({ workspaceId }: PromptViewProps) {
  const { updateWorkspaceStatus, setWorkspaceSession } = useWorkspaceStore()
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Solo se permiten archivos CSV y XLSX')
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      setError('Por favor describe tus datos')
      return
    }

    if (!file) {
      setError('Por favor selecciona un archivo')
      return
    }

    setIsLoading(true)
    setError(null)
    updateWorkspaceStatus(workspaceId, 'prompted')

    try {
      const response = await ingestData(message, file)
      // Extract suggested charts and dataset from the nested structure
      const suggestedCharts = response.chart_transform_request?.suggested_charts || []
      const dataset = response.chart_transform_request?.dataset || []
      setWorkspaceSession(workspaceId, response.session_id, dataset, suggestedCharts)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.error + (apiError.detail ? `: ${apiError.detail}` : ''))
      updateWorkspaceStatus(workspaceId, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Analiza tus datos con IA
          </h2>
          <p className="text-muted-foreground">
            Describe qué quieres visualizar y sube tu archivo de datos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Descripción
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tus datos o lo que quieres ver..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Archivo de datos
            </label>
            <div className="relative">
              <input
                id="file"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center gap-2 w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {file ? file.name : 'Selecciona un archivo CSV o XLSX'}
                </span>
              </label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Solo se aceptan archivos CSV y XLSX
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !message.trim() || !file}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Procesando con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Analizar con IA</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
