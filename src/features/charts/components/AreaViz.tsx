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

  // Use vibrant colors for better visibility in dark mode
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chart_data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={x_axis_key || 'name'}
          tick={{ fill: 'rgba(255,255,255,0.7)' }}
          fontSize={12}
        />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.7)' }} fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#fff',
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend wrapperStyle={{ color: '#fff' }} />
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
