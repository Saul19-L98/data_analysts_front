import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface BarVizProps {
  chart: ChartBuilt
}

/**
 * Bar chart visualization component
 */
export function BarViz({ chart }: BarVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  // Check if data is a placeholder/metadata structure
  const hasPlaceholderData = chart_data.length > 0 && 'note' in chart_data[0] && chart_data[0].note === 'Data structure placeholder'

  if (hasPlaceholderData || !chart_data || chart_data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
        <div className="text-center p-6">
          <p className="text-lg font-semibold text-muted-foreground mb-2">
            ⚠️ No hay datos para visualizar
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            El backend retornó metadatos en lugar de datos reales. Verifica que el endpoint /charts/transform esté procesando correctamente el dataset.
          </p>
          {hasPlaceholderData && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Ver estructura recibida
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(chart_data[0], null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chart_data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={x_axis_key || 'name'}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        {y_axis_keys && y_axis_keys.length > 0 ? (
          y_axis_keys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
          ))
        ) : (
          <Bar dataKey="value" fill={colors[0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
