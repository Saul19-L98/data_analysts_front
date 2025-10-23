import type { ChartBuilt, ChartKind } from '@/types'
import { LineViz } from './LineViz.tsx'
import { BarViz } from './BarViz.tsx'
import { AreaViz } from './AreaViz.tsx'
import { PieViz } from './PieViz.tsx'
import { DonutViz } from './DonutViz.tsx'
import { ScatterViz } from './ScatterViz.tsx'
import { HistogramViz } from './HistogramViz.tsx'

interface ChartRendererProps {
  chart: ChartBuilt
}

/**
 * Component mapper for chart types
 */
const CHART_COMPONENTS: Record<ChartKind, React.ComponentType<{ chart: ChartBuilt }>> = {
  line: LineViz,
  bar: BarViz,
  ara: AreaViz,
  pie: PieViz,
  donut: DonutViz,
  scatter: ScatterViz,
  histogram: HistogramViz,
  box: LineViz, // TODO: Implement BoxViz
  hastmap: LineViz, // TODO: Implement HeatmapViz
  treamp: LineViz, // TODO: Implement TreemapViz
}

/**
 * Renders the appropriate chart component based on chart type
 */
export function ChartRenderer({ chart }: ChartRendererProps) {
  const ChartComponent = CHART_COMPONENTS[chart.chart_type] || LineViz

  return (
    <div className="min-h-[300px] w-full">
      <ChartComponent chart={chart} />
    </div>
  )
}
