import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface DonutVizProps {
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
