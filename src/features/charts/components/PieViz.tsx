import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface PieVizProps {
  chart: ChartBuilt
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

/**
 * Pie chart visualization component
 */
export function PieViz({ chart }: PieVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

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

  // Determine the correct dataKey for the pie chart
  // For pie charts, we want to use the first y_axis_key as the value
  const valueKey = y_axis_keys && y_axis_keys.length > 0 ? y_axis_keys[0] : 'value'
  // Use x_axis_key for the name/label field
  const nameKey = x_axis_key || 'name'

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chart_data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props) => {
            const percent = props.percent as number
            return `${props.name}: ${(percent * 100).toFixed(0)}%`
          }}
          outerRadius={100}
          fill="hsl(var(--chart-1))"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {chart_data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
