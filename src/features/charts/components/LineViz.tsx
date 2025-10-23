import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

interface LineVizProps {
  chart: ChartBuilt
}

/**
 * Line chart visualization component
 */
export function LineViz({ chart }: LineVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  // Build chart config for tooltip
  const chartConfig: ChartConfig = {}
  y_axis_keys?.forEach((key, index) => {
    chartConfig[key] = {
      label: key,
      color: colors[index % colors.length],
    }
  })

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
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chart_data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey={x_axis_key || 'name'}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        {y_axis_keys && y_axis_keys.length > 0 ? (
          y_axis_keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
    </ChartContainer>
  )
}
