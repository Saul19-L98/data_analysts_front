import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface ScatterVizProps {
  chart: ChartBuilt
}

/**
 * Scatter chart visualization component
 */
export function ScatterViz({ chart }: ScatterVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={x_axis_key || 'x'}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          dataKey={y_axis_keys?.[0] || 'y'}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter
          data={chart_data}
          fill="hsl(var(--chart-1))"
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
