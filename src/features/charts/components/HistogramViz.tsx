import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface HistogramVizProps {
  chart: ChartBuilt
}

/**
 * Histogram visualization component (bar chart for frequency distribution)
 */
export function HistogramViz({ chart }: HistogramVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  // For histograms, use the first y_axis_key for frequency data
  const frequencyKey = y_axis_keys && y_axis_keys.length > 0 ? y_axis_keys[0] : 'frequency'

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chart_data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={x_axis_key || 'bin'}
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
        <Bar dataKey={frequencyKey} fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
