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
      title: 'Total de Gráficas',
      value: totalCharts,
      icon: BarChart3,
      description: 'Visualizaciones creadas',
      trend: '+12%',
      iconBgClass: 'bg-chart-1/10',
      iconColorClass: 'text-chart-1',
    },
    {
      title: 'Espacios de Trabajo',
      value: totalWorkspaces,
      icon: FolderOpen,
      description: 'Proyectos activos',
      trend: '+2',
      iconBgClass: 'bg-chart-2/10',
      iconColorClass: 'text-chart-2',
    },
    {
      title: 'Workspace Activo',
      value: activeWorkspace || 'Ninguno',
      icon: LayoutGrid,
      description: 'Vista actual',
      isText: true,
      iconBgClass: 'bg-chart-3/10',
      iconColorClass: 'text-chart-3',
    },
    {
      title: 'Calidad de Datos',
      value: '95%',
      icon: TrendingUp,
      description: 'Precisión del análisis',
      trend: '+5%',
      iconBgClass: 'bg-chart-4/10',
      iconColorClass: 'text-chart-4',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-border/50 !p-3 md:!p-4 bg-card/50 backdrop-blur transition-all hover:border-border hover:shadow-lg hover:-translate-y-0.5"
          aria-label={`${stat.title}: ${stat.value}`}
        >
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-[10px] md:text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.title}
              </CardDescription>
              <div className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg ${stat.iconBgClass}`}>
                <stat.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${stat.iconColorClass}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-3xl font-bold text-foreground truncate">
              {stat.isText ? stat.value : stat.value.toLocaleString()}
            </div>
            <p className="mt-1 text-[10px] md:text-xs text-muted-foreground">
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
