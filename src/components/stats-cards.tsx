import { BarChart3, LayoutGrid, FolderOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardsProps {
  totalCharts: number
  totalWorkspaces: number
  activeWorkspace?: string
}

export function StatsCards({ totalCharts, totalWorkspaces, activeWorkspace }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Charts',
      value: totalCharts,
      icon: BarChart3,
      description: 'Visualizations created',
      trend: '+12%',
    },
    {
      title: 'Workspaces',
      value: totalWorkspaces,
      icon: FolderOpen,
      description: 'Active projects',
      trend: '+2',
    },
    {
      title: 'Active Workspace',
      value: activeWorkspace || 'None',
      icon: LayoutGrid,
      description: 'Currently viewing',
      isText: true,
    },
    {
      title: 'Data Insights',
      value: '95%',
      icon: TrendingUp,
      description: 'Analysis accuracy',
      trend: '+5%',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.isText ? stat.value : stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {stat.trend && (
                <span className="text-primary font-medium">{stat.trend}</span>
              )}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
