import { useState } from 'react'
import { Upload, Sparkles, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { ingestData } from '@/services/api'
import type { ApiError } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

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
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const selectedFile = files[0]
      if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Solo se permiten archivos CSV y XLSX')
      }
    }
  }

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
      
      // Check if agent failed to process the request
      if (!response.chart_transform_request || response.chart_transform_request === null) {
        const errorMessage = response.message || 'El agente no pudo procesar tu prompt, trata de ser más específico'
        setError(errorMessage)
        updateWorkspaceStatus(workspaceId, 'empty')
        return
      }
      
      // Extract suggested charts and dataset from the nested structure
      const suggestedCharts = response.chart_transform_request.suggested_charts || []
      const dataset = response.chart_transform_request.dataset || []
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
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Análisis con IA</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
            Analiza tus datos con IA
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Describe qué quieres visualizar y sube tu archivo de datos
          </p>
        </div>

        {/* Form */}
        <Card className="border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-card-foreground">
                Descripción
              </label>
              <Textarea
                id="description"
                placeholder="Describe tus datos o lo que quieres ver..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                className="min-h-[120px] resize-none bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Archivo de datos</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      Cambiar archivo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Selecciona un archivo CSV o XLSX
                      </p>
                      <p className="text-sm text-muted-foreground">
                        o arrastra y suelta aquí
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Solo se aceptan archivos CSV y XLSX</p>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !message.trim() || !file}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  <span>Procesando con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Analizar con IA</span>
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
