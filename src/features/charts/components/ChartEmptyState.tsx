import { BarChart3 } from 'lucide-react'

interface ChartEmptyStateProps {
  placeholderData?: Record<string, unknown>
}

/**
 * Shared empty/placeholder state for all chart components.
 * Shows when data is missing or the backend returns metadata instead of real data.
 */
export function ChartEmptyState({ placeholderData }: ChartEmptyStateProps) {
  return (
    <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
      <div className="text-center p-6">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <p className="text-base font-semibold text-muted-foreground mb-1">
          No hay datos para visualizar
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          El backend retornó metadatos en lugar de datos reales. Verifica que el endpoint esté procesando correctamente.
        </p>
        {placeholderData && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Ver estructura recibida
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(placeholderData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
