import { useState, useEffect, useRef } from 'react'
import { Upload, Sparkles, FileSpreadsheet, AlertCircle, X } from 'lucide-react'
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

const LOADING_STEPS = [
  'Subiendo archivo...',
  'Analizando estructura de datos...',
  'Generando sugerencias con IA...',
]

const MAX_DESCRIPTION_LENGTH = 500

/**
 * Prompt view for file upload and AI analysis
 */
export function PromptView({ workspaceId }: PromptViewProps) {
  const { updateWorkspaceStatus, setWorkspaceSession } = useWorkspaceStore()
  // const workspace = getWorkspace(workspaceId)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Cycle through loading steps for UX feedback
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
    }, 3000)
    return () => clearInterval(interval)
  }, [isLoading])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleDropZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
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

      if (!response.chart_transform_request || response.chart_transform_request === null) {
        const errorMessage = response.message || 'El agente no pudo procesar tu prompt, trata de ser más específico'
        setError(errorMessage)
        updateWorkspaceStatus(workspaceId, 'empty')
        return
      }

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex min-h-full items-center justify-center !p-6">
      <div className="w-full max-w-2xl space-y-8 animate-scale-in">
        {/* Workspace context banner */}
        {/* {workspace?.name && (
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-4 text-center space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{workspace.name}</h2>
            {workspace.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{workspace.description}</p>
            )}
          </div>
        )} */}

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
        <Card className="border-border/60 bg-card !p-4 shadow-xl ring-1 ring-border/30">
          <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isLoading}>
            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-card-foreground">
                Descripción
              </label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Describe tus datos o lo que quieres ver..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                  disabled={isLoading}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  aria-describedby={error ? 'prompt-error' : undefined}
                  className="!px-2  min-h-[120px] resize-none bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary/20"
                />
                <span
                  className="absolute bottom-2 right-3 text-xs text-muted-foreground/60 select-none"
                  aria-hidden="true"
                >
                  {message.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Archivo de datos</label>
              <div
                ref={dropZoneRef}
                role="button"
                tabIndex={0}
                aria-label="Seleccionar archivo CSV o XLSX para analizar"
                aria-describedby={error ? 'prompt-error' : undefined}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onKeyDown={handleDropZoneKeyDown}
                className={cn(
                  'relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : file
                      ? 'border-primary/40 bg-primary/[0.03]'
                      : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40',
                  isLoading && 'cursor-not-allowed opacity-60 pointer-events-none'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  aria-label="Seleccionar archivo CSV o XLSX"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  tabIndex={-1}
                />

                {file ? (
                  <div className="relative flex items-center gap-4 p-4 w-full max-w-sm">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <FileSpreadsheet className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} &middot; {file.name.endsWith('.csv') ? 'CSV' : 'XLSX'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                      }}
                      disabled={isLoading}
                      className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Eliminar archivo seleccionado"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center p-6">
                    <div className="rounded-full bg-muted p-4 transition-colors group-hover:bg-primary/10">
                      <Upload className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Selecciona un archivo CSV o XLSX
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Arrastra y suelta, o presiona para seleccionar
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Solo se aceptan archivos CSV y XLSX</p>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" aria-live="assertive">
                <Alert variant="destructive" id="prompt-error" className="animate-fade-in-up">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Loading progress steps */}
            {isLoading && (
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4" aria-live="polite">
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                <span className="text-sm font-medium text-primary">
                  {LOADING_STEPS[loadingStep]}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !message.trim() || !file}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 rounded-xl py-6 text-base cursor-pointer"
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
