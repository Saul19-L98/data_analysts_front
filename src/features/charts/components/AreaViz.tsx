import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface AreaVizProps {
  chart: ChartBuilt
}

/**
 * Area chart visualization component
 */
export function AreaViz({ chart }: AreaVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chart_data}>
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
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))
        ) : (
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            fill={colors[0]}
            fillOpacity={0.6}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
