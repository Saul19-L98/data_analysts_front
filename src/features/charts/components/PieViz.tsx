import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'
import { CHART_PALETTE } from '../constants'
import { useChartTheme } from '../hooks/useChartTheme'
import { ChartEmptyState } from './ChartEmptyState'
import { isPlaceholderData } from '../utils'

interface PieVizProps {
  chart: ChartBuilt
}

export function PieViz({ chart }: PieVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart
  const theme = useChartTheme()

  if (isPlaceholderData(chart_data)) {
    return <ChartEmptyState placeholderData={chart_data?.[0]} />
  }

  const valueKey = y_axis_keys && y_axis_keys.length > 0 ? y_axis_keys[0] : 'value'
  const nameKey = x_axis_key || 'name'

  return (
    <ResponsiveContainer width="100%" height="100%">
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
          outerRadius="75%"
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {chart_data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={theme.tooltipStyle} itemStyle={theme.tooltipItemStyle} labelStyle={theme.tooltipLabelStyle} />
        <Legend wrapperStyle={{ color: theme.legendColor }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
