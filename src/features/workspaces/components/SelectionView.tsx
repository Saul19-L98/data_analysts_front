import { useState } from 'react'
import { Check, ArrowLeft, Sparkles, AlertCircle, Flame, Minus, ArrowDown } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { transformCharts } from '@/services/api'
import type { ApiError } from '@/types'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface SelectionViewProps {
  workspaceId: string
}

function getChartIcon(type: string) {
  switch (type) {
    case 'line':
      return <LineChartIcon className="w-7 h-7" />
    case 'bar':
    case 'histogram':
      return <BarChart3 className="w-7 h-7" />
    case 'pie':
    case 'donut':
      return <PieChartIcon className="w-7 h-7" />
    case 'scatter':
      return <ScatterChartIcon className="w-7 h-7" />
    case 'ara':
      return <TrendingUp className="w-7 h-7" />
    default:
      return <BarChart3 className="w-7 h-7" />
  }
}

const PRIORITY_CONFIG = {
  high: { label: 'Alta', icon: Flame, className: 'bg-destructive/10 text-destructive' },
  medium: { label: 'Media', icon: Minus, className: 'bg-amber-500/10 text-amber-600' },
  low: { label: 'Baja', icon: ArrowDown, className: 'bg-muted text-muted-foreground' },
} as const

/**
 * Selection view for choosing suggested charts
 */
export function SelectionView({ workspaceId }: SelectionViewProps) {
  const { getWorkspace, updateWorkspaceStatus, setWorkspaceCharts, setSelectedCharts } =
    useWorkspaceStore()
  const workspace = getWorkspace(workspaceId)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buildingIndex, setBuildingIndex] = useState(-1)

  const suggestedCharts = workspace?.selected || []

  const toggleSelection = (index: number) => {
    if (isLoading) return
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
  }

  const toggleAll = () => {
    if (selected.size === suggestedCharts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(suggestedCharts.map((_, i) => i)))
    }
  }

  const handleBack = () => {
    updateWorkspaceStatus(workspaceId, 'empty')
  }

  const handleCreateDashboard = async () => {
    if (selected.size === 0) return

    const selectedCharts = Array.from(selected).map((index) => suggestedCharts[index])
    setSelectedCharts(workspaceId, selectedCharts)

    setIsLoading(true)
    setError(null)
    updateWorkspaceStatus(workspaceId, 'building')

    try {
      const allTransformedCharts = []

      for (let i = 0; i < selectedCharts.length; i++) {
        const chart = selectedCharts[i]
        setBuildingIndex(i)

        const transformRequest = {
          session_id: workspace?.sessionId || '',
          suggested_charts: [chart],
          dataset: workspace?.dataset || [],
        }

        const response = await transformCharts(transformRequest)

        if (response.charts && response.charts.length > 0) {
          allTransformedCharts.push(...response.charts)
        }
      }

      setBuildingIndex(-1)

      if (allTransformedCharts.length === 0) {
        setError('No se pudo transformar ninguna gráfica')
        updateWorkspaceStatus(workspaceId, 'empty')
        return
      }

      if (allTransformedCharts.length < selectedCharts.length) {
        setError(
          `Solo se transformaron ${allTransformedCharts.length} de ${selectedCharts.length} gráficas seleccionadas`
        )
      }

      setWorkspaceCharts(workspaceId, allTransformedCharts)
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.error || 'El agente no pudo procesar tu solicitud, trata de ser más específico'
      setError(errorMessage + (apiError.detail ? `: ${apiError.detail}` : ''))
      updateWorkspaceStatus(workspaceId, 'empty')
    } finally {
      setIsLoading(false)
      setBuildingIndex(-1)
    }
  }

  const allSelected = selected.size === suggestedCharts.length && suggestedCharts.length > 0

  return (
    <div className="h-full flex flex-col !p-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Selecciona tus visualizaciones
        </h2>
        <p className="text-muted-foreground">
          Elige las gráficas que quieres incluir en tu dashboard
        </p>
      </div>

      {/* Select all toggle */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={toggleAll}
          disabled={isLoading}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
        <span className="text-sm text-muted-foreground">
          {selected.size} de {suggestedCharts.length} seleccionadas
        </span>
      </div>

      {/* Chart cards grid */}
      <div className="flex-1 overflow-y-auto mb-6" role="group" aria-label="Gráficas sugeridas por IA">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggestedCharts.map((chart, index) => {
            const isSelected = selected.has(index)
            const isBuilding = isLoading && buildingIndex === index
            const isBuilt = isLoading && buildingIndex > index && selected.has(index)
            const isPending = isLoading && buildingIndex < index && selected.has(index)

            return (
              <button
                key={index}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={`${chart.title} — tipo ${chart.chart_type}${chart.priority ? `, prioridad ${PRIORITY_CONFIG[chart.priority]?.label || chart.priority}` : ''}`}
                onClick={() => toggleSelection(index)}
                disabled={isLoading}
                className={cn(
                  'relative !p-5 bg-card rounded-xl border-2 transition-all duration-200 text-left cursor-pointer',
                  'hover:shadow-md hover:scale-[1.01]',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.03]'
                    : 'border-border/60 hover:border-primary/40',
                  isLoading && 'cursor-default hover:scale-100',
                  isLoading && isPending && 'opacity-50',
                )}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Building overlay */}
                {isBuilding && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      <span className="text-sm font-medium">Construyendo...</span>
                    </div>
                  </div>
                )}

                {/* Built check overlay */}
                {isBuilt && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {getChartIcon(chart.chart_type)}
                  </div>
                  {!isLoading && (
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                        isSelected
                          ? 'border-primary bg-primary scale-110'
                          : 'border-border'
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold text-foreground mb-1.5">{chart.title}</h3>

                {chart.insight && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{chart.insight}</p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-secondary rounded-full text-secondary-foreground">
                    {getChartIcon(chart.chart_type) &&
                      <span className="[&>svg]:w-3 [&>svg]:h-3">{getChartIcon(chart.chart_type)}</span>
                    }
                    {chart.chart_type}
                  </span>
                  {chart.priority && PRIORITY_CONFIG[chart.priority] && (() => {
                    const config = PRIORITY_CONFIG[chart.priority]
                    const PriorityIcon = config.icon
                    return (
                      <span className={cn('inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full', config.className)}>
                        <PriorityIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    )
                  })()}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading progress announcement */}
      {isLoading && buildingIndex >= 0 && (
        <div className="sr-only" aria-live="polite">
          Construyendo gráfica {buildingIndex + 1} de {Array.from(selected).length}
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive">
          <Alert variant="destructive" className="mb-4 animate-fade-in-up">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al transformar gráficas</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleBack}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>

        <Button
          onClick={handleCreateDashboard}
          disabled={selected.size === 0 || isLoading}
          className="flex-1 rounded-xl py-5 text-base cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Construyendo dashboard ({buildingIndex + 1}/{Array.from(selected).length})...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Crear dashboard ({selected.size} seleccionada{selected.size !== 1 ? 's' : ''})
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
