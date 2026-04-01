import { useState } from 'react'
import { Pencil, Check, X, BarChart3, ArrowLeft } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { ChartRenderer } from '@/features/charts/components/ChartRenderer'
import type { ChartBuilt, ChartKind } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatsCards } from '@/components/stats-cards'
import { cn } from '@/lib/utils'

const CHART_TYPE_COLORS: Record<string, string> = {
  line: 'from-blue-500 to-blue-400',
  bar: 'from-violet-500 to-violet-400',
  ara: 'from-emerald-500 to-emerald-400',
  pie: 'from-amber-500 to-amber-400',
  donut: 'from-rose-500 to-rose-400',
  scatter: 'from-cyan-500 to-cyan-400',
  histogram: 'from-purple-500 to-purple-400',
}

function isCompactChart(type: ChartKind): boolean {
  return type === 'pie' || type === 'donut'
}

/**
 * Dashboard view displaying built charts
 */
export function DashboardView({ workspaceId }: { workspaceId: string }) {
  const { getWorkspace, updateChartTitle, updateWorkspaceStatus, workspaces } = useWorkspaceStore()
  const workspace = getWorkspace(workspaceId)
  const [editingChartId, setEditingChartId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const charts = workspace?.charts || []

  const handleEditStart = (chart: ChartBuilt) => {
    setEditingChartId(chart.id)
    setEditTitle(chart.title)
  }

  const handleEditSave = (chartId: string) => {
    if (editTitle.trim()) {
      updateChartTitle(workspaceId, chartId, editTitle.trim())
    }
    setEditingChartId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingChartId(null)
    setEditTitle('')
  }

  if (charts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">No hay gráficas en este dashboard</p>
            <p className="text-sm text-muted-foreground">
              Vuelve al análisis para generar nuevas visualizaciones
            </p>
          </div>
          <Button
            onClick={() => updateWorkspaceStatus(workspaceId, 'empty')}
            variant="secondary"
            className="flex items-center gap-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al análisis
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in-up">
      {/* Fixed Header Section */}
      <div className="shrink-0 space-y-6 md:space-y-8 py-6 md:py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-2 !my-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {workspace?.name || 'Dashboard'}
          </h2>
          {workspace?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {workspace.description}
            </p>
          )}
          <p className="text-muted-foreground">
            Visualizando {charts.length} gráfica{charts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="!my-4">
          <StatsCards
            totalCharts={charts.length}
            totalWorkspaces={workspaces.length}
            activeWorkspace={workspace?.name}
          />
        </div>
      </div>

      {/* Scrollable Charts Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 lg:px-8 pb-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charts.map((chart, index) => {
            const compact = isCompactChart(chart.chart_type)
            const colorGradient = CHART_TYPE_COLORS[chart.chart_type] || 'from-primary to-primary'

            return (
              <section
                key={chart.id}
                aria-label={chart.title}
                className={cn(
                  compact ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-1 md:col-span-2 lg:col-span-3'
                )}
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <Card className="flex flex-col overflow-hidden rounded-2xl border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Colored top strip */}
                  <div className={cn('h-1 w-full bg-gradient-to-r', colorGradient)} aria-hidden="true" />

                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex-1 space-y-1 min-w-0">
                      {editingChartId === chart.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave(chart.id)
                              if (e.key === 'Escape') handleEditCancel()
                            }}
                            aria-label="Nuevo título de la gráfica"
                            className="h-8 text-lg font-semibold"
                            autoFocus
                          />
                          <Button
                            onClick={() => handleEditSave(chart.id)}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-primary cursor-pointer"
                            aria-label="Guardar título"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleEditCancel}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 cursor-pointer"
                            aria-label="Cancelar edición"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 group">
                            <CardTitle className="text-xl line-clamp-1">{chart.title}</CardTitle>
                            <Button
                              onClick={() => handleEditStart(chart)}
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0 opacity-40 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                              aria-label="Editar título de la gráfica"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          {chart.description && (
                            <CardDescription className="line-clamp-2">
                              {chart.description}
                            </CardDescription>
                          )}
                        </>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-4 md:p-6">
                    <div className={cn(
                      'w-full',
                      compact ? 'h-[300px] md:h-[350px]' : 'h-[300px] md:h-[400px] lg:h-[500px]'
                    )}>
                      <ChartRenderer chart={chart} />
                    </div>
                  </CardContent>
                </Card>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
