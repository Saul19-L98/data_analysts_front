import { BarChart3, LayoutGrid, FolderOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

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
      iconBgClass: 'bg-chart-1/10',
      iconColorClass: 'text-chart-1',
    },
    {
      title: 'Workspaces',
      value: totalWorkspaces,
      icon: FolderOpen,
      description: 'Active projects',
      trend: '+2',
      iconBgClass: 'bg-chart-2/10',
      iconColorClass: 'text-chart-2',
    },
    {
      title: 'Active Workspace',
      value: activeWorkspace || 'None',
      icon: LayoutGrid,
      description: 'Currently viewing',
      isText: true,
      iconBgClass: 'bg-chart-3/10',
      iconColorClass: 'text-chart-3',
    },
    {
      title: 'Data Insights',
      value: '95%',
      icon: TrendingUp,
      description: 'Analysis accuracy',
      trend: '+5%',
      iconBgClass: 'bg-chart-4/10',
      iconColorClass: 'text-chart-4',
    },
  ]

  return (
    <div className="gap-4 md:grid-cols-2 lg:grid-cols-4 hidden md:grid">
      {stats.map((stat) => (
        <Card 
          key={stat.title}
          className="border-border/50 !p-4 bg-card/50 backdrop-blur transition-all hover:border-border hover:shadow-lg"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.title}
              </CardDescription>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBgClass}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColorClass}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stat.isText ? stat.value : stat.value.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stat.trend && (
                <span className="text-primary font-medium">{stat.trend} </span>
              )}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
