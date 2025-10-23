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
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={x_axis_key || 'x'}
          tick={{ fill: 'rgba(255,255,255,0.7)' }}
          fontSize={12}
        />
        <YAxis
          dataKey={y_axis_keys?.[0] || 'y'}
          tick={{ fill: 'rgba(255,255,255,0.7)' }}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#fff',
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#fff' }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter
          data={chart_data}
          fill="#8b5cf6"
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
