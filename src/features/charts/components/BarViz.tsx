import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ChartBuilt } from '@/types'

interface BarVizProps {
  chart: ChartBuilt
}

/**
 * Bar chart visualization component
 */
export function BarViz({ chart }: BarVizProps) {
  const { chart_data, x_axis_key, y_axis_keys } = chart

  // Use vibrant colors for better visibility in dark mode
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

  // Check if data is a placeholder/metadata structure
  const hasPlaceholderData = chart_data.length > 0 && 'note' in chart_data[0] && chart_data[0].note === 'Data structure placeholder'

  if (hasPlaceholderData || !chart_data || chart_data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
        <div className="text-center p-6">
          <p className="text-lg font-semibold text-muted-foreground mb-2">
            ⚠️ No hay datos para visualizar
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            El backend retornó metadatos en lugar de datos reales. Verifica que el endpoint /charts/transform esté procesando correctamente el dataset.
          </p>
          {hasPlaceholderData && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Ver estructura recibida
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(chart_data[0], null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chart_data}>
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
            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
          ))
        ) : (
          <Bar dataKey="value" fill={colors[0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
