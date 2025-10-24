import { useState } from 'react'
import { Check, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
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
      console.log('🔵 Starting transform process for', selectedCharts.length, 'charts')
      console.log('📋 Chart titles:', selectedCharts.map(c => c.title))
      
      const allTransformedCharts = []

      // Call transform endpoint once for each chart
      for (let i = 0; i < selectedCharts.length; i++) {
        const chart = selectedCharts[i]
        
        console.log(`\n� [${i + 1}/${selectedCharts.length}] Transforming chart: "${chart.title}"`)
        
        const transformRequest = {
          session_id: workspace?.sessionId || '',
          suggested_charts: [chart], // Send only ONE chart at a time
          dataset: workspace?.dataset || [],
        }
        
        console.log('🔍 Request:', JSON.stringify(transformRequest, null, 2))
        
        const response = await transformCharts(transformRequest)
        
        console.log(`✅ [${i + 1}/${selectedCharts.length}] Response received:`, response.charts.length, 'chart(s)')
        
        // Add all charts from response to our collection
        if (response.charts && response.charts.length > 0) {
          allTransformedCharts.push(...response.charts)
        } else {
          console.warn(`⚠️ Chart "${chart.title}" returned no data`)
        }
      }
      
      console.log('\n🎉 All transforms complete!')
      console.log('📊 Total charts transformed:', allTransformedCharts.length, '/', selectedCharts.length)
      
      // Check if we got all expected charts
      if (allTransformedCharts.length === 0) {
        setError('No se pudo transformar ninguna gráfica')
        updateWorkspaceStatus(workspaceId, 'empty')
        return
      }
      
      if (allTransformedCharts.length < selectedCharts.length) {
        console.warn(`⚠️ Some charts failed to transform`)
        setError(
          `Solo se transformaron ${allTransformedCharts.length} de ${selectedCharts.length} gráficas seleccionadas`
        )
      }
      
      setWorkspaceCharts(workspaceId, allTransformedCharts)
    } catch (err) {
      const apiError = err as ApiError
      console.error('🔴 Transform Error:', apiError)
      const errorMessage = apiError.error || 'El agente no pudo procesar tu solicitud, trata de ser más específico'
      setError(errorMessage + (apiError.detail ? `: ${apiError.detail}` : ''))
      // Redirect to prompt page on transform failure
      updateWorkspaceStatus(workspaceId, 'empty')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col !p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Selecciona tus visualizaciones
        </h2>
        <p className="text-muted-foreground">
          Elige las gráficas que quieres incluir en tu dashboard
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 !mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedCharts.map((chart, index) => (
            <button
              key={index}
              onClick={() => toggleSelection(index)}
              className={cn(
                '!p-2 bg-card border-2 rounded-lg transition-all duration-200 text-left',
                'hover:!bg-white/10 hover:!border-fuchsia-500/10',
                selected.has(index)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
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
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al transformar gráficas</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleBack}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>

        <Button
          onClick={handleCreateDashboard}
          disabled={selected.size === 0 || isLoading}
          className="flex-1"
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
        </Button>
      </div>
    </div>
  )
}
