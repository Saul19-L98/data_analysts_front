import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { ChartRenderer } from '@/features/charts/components/ChartRenderer'
import type { ChartBuilt } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatsCards } from '@/components/stats-cards'

/**
 * Dashboard view displaying built charts
 */
export function DashboardView({ workspaceId }: { workspaceId: string }) {
  const { getWorkspace, updateChartTitle, workspaces } = useWorkspaceStore()
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
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No hay gráficas en este dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header Section */}
      <div className="shrink-0 space-y-6 md:space-y-8 py-6 md:py-8 px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col gap-2 !my-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {workspace?.name || 'Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            Visualizando {charts.length} gráfica{charts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats Overview */}
        <div className='!my-4'>
          <StatsCards
            totalCharts={charts.length}
            totalWorkspaces={workspaces.length}
            activeWorkspace={workspace?.name}
          />
        </div>
      </div>

      {/* Scrollable Charts Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 lg:px-8 pb-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {charts.map((chart) => (
            <Card key={chart.id} className="flex flex-col col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1 space-y-1">
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
                        className="h-8 text-lg font-semibold"
                        autoFocus
                      />
                      <Button onClick={() => handleEditSave(chart.id)} size="icon" variant="ghost" className="h-8 w-8 text-primary" title="Guardar">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleEditCancel} size="icon" variant="ghost" className="h-8 w-8" title="Cancelar">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 group">
                        <CardTitle className="text-xl line-clamp-1">{chart.title}</CardTitle>
                        <Button onClick={() => handleEditStart(chart)} size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
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

              <CardContent className="flex-1 p-6">
                <div className="h-[450px] w-full">
                  <ChartRenderer chart={chart} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
