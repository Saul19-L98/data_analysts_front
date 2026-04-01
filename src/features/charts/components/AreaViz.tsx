import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'
import { CHART_PALETTE } from '../constants'
import { useChartTheme } from '../hooks/useChartTheme'
import { ChartEmptyState } from './ChartEmptyState'
import { isPlaceholderData } from '../utils'

interface AreaVizProps {
  chart: ChartBuilt
}

export function AreaViz({ chart }: AreaVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart
  const theme = useChartTheme()

  if (isPlaceholderData(chart_data)) {
    return <ChartEmptyState placeholderData={chart_data?.[0]} />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chart_data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
        <XAxis dataKey={x_axis_key || 'name'} tick={{ fill: theme.tickFill }} fontSize={12} />
        <YAxis tick={{ fill: theme.tickFill }} fontSize={12} />
        <Tooltip contentStyle={theme.tooltipStyle} itemStyle={theme.tooltipItemStyle} labelStyle={theme.tooltipLabelStyle} />
        <Legend wrapperStyle={{ color: theme.legendColor }} />
        {y_axis_keys && y_axis_keys.length > 0 ? (
          y_axis_keys.map((key, index) => (
            <Area key={key} type="monotone" dataKey={key} stroke={CHART_PALETTE[index % CHART_PALETTE.length]} fill={CHART_PALETTE[index % CHART_PALETTE.length]} fillOpacity={0.3} />
          ))
        ) : (
          <Area type="monotone" dataKey="value" stroke={CHART_PALETTE[0]} fill={CHART_PALETTE[0]} fillOpacity={0.3} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
