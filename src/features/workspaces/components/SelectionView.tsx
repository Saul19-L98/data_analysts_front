import { useState } from 'react'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'
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

interface SelectionViewProps {
  workspaceId: string
}

/**
 * Icon mapper for chart types
 */
function getChartIcon(type: string) {
  switch (type) {
    case 'line':
      return <LineChartIcon className="w-8 h-8" />
    case 'bar':
    case 'histogram':
      return <BarChart3 className="w-8 h-8" />
    case 'pie':
    case 'donut':
      return <PieChartIcon className="w-8 h-8" />
    case 'scatter':
      return <ScatterChartIcon className="w-8 h-8" />
    case 'ara':
      return <TrendingUp className="w-8 h-8" />
    default:
      return <BarChart3 className="w-8 h-8" />
  }
}

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

  const suggestedCharts = workspace?.selected || []

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
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
      const transformRequest = {
        session_id: workspace?.sessionId || '',
        suggested_charts: selectedCharts,
        dataset: workspace?.dataset || [],
      }
      
      console.log('🔵 Transform Request:', JSON.stringify(transformRequest, null, 2))
      
      const response = await transformCharts(transformRequest)
      
      console.log('🟢 Transform Response:', JSON.stringify(response, null, 2))
      console.log('📊 Charts received:', response.charts.length)
      
      // Log first chart data structure
      if (response.charts.length > 0) {
        console.log('📈 First chart data sample:', response.charts[0].chart_data.slice(0, 2))
      }
      
      setWorkspaceCharts(workspaceId, response.charts)
    } catch (err) {
      const apiError = err as ApiError
      console.error('🔴 Transform Error:', apiError)
      setError(apiError.error + (apiError.detail ? `: ${apiError.detail}` : ''))
      updateWorkspaceStatus(workspaceId, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Selecciona tus visualizaciones
        </h2>
        <p className="text-muted-foreground">
          Elige las gráficas que quieres incluir en tu dashboard
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedCharts.map((chart, index) => (
            <button
              key={index}
              onClick={() => toggleSelection(index)}
              className={cn(
                'p-6 bg-card border-2 rounded-lg transition-all text-left',
                'hover:shadow-lg',
                selected.has(index)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-muted-foreground">{getChartIcon(chart.chart_type)}</div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    selected.has(index)
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  )}
                >
                  {selected.has(index) && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{chart.title}</h3>

              {chart.insight && (
                <p className="text-sm text-muted-foreground line-clamp-3">{chart.insight}</p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                  {chart.chart_type}
                </span>
                {chart.priority && (
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      chart.priority === 'high' && 'bg-destructive/10 text-destructive',
                      chart.priority === 'medium' && 'bg-amber-500/10 text-amber-600',
                      chart.priority === 'low' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {chart.priority}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <button
          onClick={handleCreateDashboard}
          disabled={selected.size === 0 || isLoading}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Construyendo tu dashboard...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Crear dashboard ({selected.size} seleccionado{selected.size !== 1 ? 's' : ''})
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
