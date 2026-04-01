import { BarChart3, LayoutGrid, FolderOpen, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  totalCharts: number
  totalWorkspaces: number
  activeWorkspace?: string
}

export function StatsCards({ totalCharts, totalWorkspaces, activeWorkspace }: StatsCardsProps) {
  const tags = [
    {
      label: `${totalCharts} gráficas`,
      icon: BarChart3,
      className: 'bg-chart-1/10 text-chart-1',
    },
    {
      label: `${totalWorkspaces} workspaces`,
      icon: FolderOpen,
      className: 'bg-chart-2/10 text-chart-2',
    },
    {
      label: activeWorkspace || 'Sin workspace',
      icon: LayoutGrid,
      className: 'bg-chart-3/10 text-chart-3',
    },
    {
      label: '95% calidad',
      icon: TrendingUp,
      className: 'bg-chart-4/10 text-chart-4',
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tag.className}`}
        >
          <tag.icon className="h-3 w-3" />
          {tag.label}
        </span>
      ))}
    </div>
  )
}
