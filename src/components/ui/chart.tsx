/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
    icon?: React.ComponentType
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }
  return context
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children, ...props }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div {...props}>{children}</div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    payload: Record<string, unknown>
  }>
  label?: string
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div 
      className="rounded-lg border px-3 py-2 text-sm shadow-md"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff'
      }}
    >
      {label && <div className="font-medium mb-1" style={{ color: '#fff' }}>{label}</div>}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const key = item.dataKey
          const itemConfig = config[key]
          return (
            <div key={index} className="flex items-center gap-2">
              {itemConfig?.color && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: itemConfig.color }}
                />
              )}
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {itemConfig?.label || key}:
              </span>
              <span className="font-medium" style={{ color: '#fff' }}>{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { ChartConfig }
