import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'
import { CHART_PALETTE } from '../constants'
import { useChartTheme } from '../hooks/useChartTheme'
import { ChartEmptyState } from './ChartEmptyState'
import { isPlaceholderData } from '../utils'

interface ScatterVizProps {
  chart: ChartBuilt
}

export function ScatterViz({ chart }: ScatterVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart
  const theme = useChartTheme()

  if (isPlaceholderData(chart_data)) {
    return <ChartEmptyState placeholderData={chart_data?.[0]} />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
        <XAxis dataKey={x_axis_key || 'x'} tick={{ fill: theme.tickFill }} fontSize={12} />
        <YAxis dataKey={y_axis_keys?.[0] || 'y'} tick={{ fill: theme.tickFill }} fontSize={12} />
        <Tooltip contentStyle={theme.tooltipStyle} itemStyle={theme.tooltipItemStyle} labelStyle={theme.tooltipLabelStyle} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={chart_data} fill={CHART_PALETTE[0]} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
