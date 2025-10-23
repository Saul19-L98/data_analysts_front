import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface DonutVizProps {
  chart: ChartBuilt
}

const COLORS = [
  '#8b5cf6',  // Purple
  '#10b981',  // Green
  '#f59e0b',  // Amber
  '#ef4444',  // Red
  '#3b82f6',  // Blue
]

/**
 * Donut chart visualization component (pie with inner radius)
 */
export function DonutViz({ chart }: DonutVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  // Determine the correct dataKey for the donut chart
  const valueKey = y_axis_keys && y_axis_keys.length > 0 ? y_axis_keys[0] : 'value'
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
          innerRadius={60}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {chart_data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  )
}
