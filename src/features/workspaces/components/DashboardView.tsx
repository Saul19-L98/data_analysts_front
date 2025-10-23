import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { ChartRenderer } from '@/features/charts/components/ChartRenderer'
import type { ChartBuilt } from '@/types'

interface DashboardViewProps {
  workspaceId: string
}

/**
 * Dashboard view displaying built charts
 */
export function DashboardView({ workspaceId }: DashboardViewProps) {
  const { getWorkspace, updateChartTitle } = useWorkspaceStore()
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
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {workspace?.name || 'Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            {charts.length} visualización{charts.length !== 1 ? 'es' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {charts.map((chart) => (
            <div
              key={chart.id}
              className="bg-card border border-border rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {editingChartId === chart.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(chart.id)
                          if (e.key === 'Escape') handleEditCancel()
                        }}
                        className="flex-1 px-3 py-2 text-xl font-semibold bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSave(chart.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Guardar"
                        aria-label="Guardar"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Cancelar"
                        aria-label="Cancelar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h3 className="text-xl font-semibold text-foreground">{chart.title}</h3>
                      <button
                        onClick={() => handleEditStart(chart)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                        title="Editar título"
                        aria-label="Editar título"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {chart.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{chart.description}</p>
                  )}
                </div>
              </div>

              <div className="min-h-[300px]">
                <ChartRenderer chart={chart} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
