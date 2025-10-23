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
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={x_axis_key || 'bin'}
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
        <Bar dataKey={frequencyKey} fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
