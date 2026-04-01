import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { PromptView } from './PromptView'
import { SelectionView } from './SelectionView'
import { DashboardView } from './DashboardView'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  Upload,
  Brain,
  ArrowRight,
} from 'lucide-react'

const FLOATING_ICONS = [
  { Icon: BarChart3, style: { top: '8%', left: '12%', animationDelay: '0s' } },
  { Icon: LineChart, style: { top: '15%', right: '18%', animationDelay: '0.8s' } },
  { Icon: PieChart, style: { bottom: '22%', left: '8%', animationDelay: '1.6s' } },
  { Icon: ScatterChart, style: { bottom: '18%', right: '10%', animationDelay: '0.4s' } },
  { Icon: BarChart3, style: { top: '40%', left: '5%', animationDelay: '1.2s' } },
  { Icon: LineChart, style: { top: '35%', right: '6%', animationDelay: '2s' } },
  { Icon: PieChart, style: { top: '6%', left: '45%', animationDelay: '0.6s' } },
  { Icon: ScatterChart, style: { bottom: '8%', left: '35%', animationDelay: '1.4s' } },
]

const FEATURE_PILLS = [
  { icon: Upload, label: 'Arrastra archivos' },
  { icon: Brain, label: 'IA Analiza' },
  { icon: BarChart3, label: 'Dashboards Interactivos' },
]

/**
 * Main workspace content area that renders the appropriate view
 * based on workspace status
 */
export function WorkspaceContent() {
  const { activeWorkspaceId, getActiveWorkspace, addWorkspace } = useWorkspaceStore()
  const workspace = getActiveWorkspace()

  const handleCreateWorkspace = () => {
    addWorkspace()
  }

  if (!activeWorkspaceId || !workspace) {
    return (
      <div className="relative flex items-center justify-center h-full overflow-hidden bg-background">
        {/* Decorative gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-chart-5/[0.08] blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-chart-2/[0.05] blur-[80px]" />
        </div>

        {/* Floating chart icons */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {FLOATING_ICONS.map(({ Icon, style }, i) => (
            <div
              key={i}
              className="absolute text-muted-foreground/[0.08] animate-[float_6s_ease-in-out_infinite]"
              style={style}
            >
              <Icon className="h-10 w-10 md:h-14 md:w-14" strokeWidth={1} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl px-6">
          {/* Icon cluster */}
          <div
            className="flex items-center gap-3 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <div className="flex -space-x-2">
              {[BarChart3, PieChart, LineChart].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm"
                >
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-fade-in-up opacity-0"
              style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}
            >
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                Data Helper
              </span>
            </h2>
            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto animate-fade-in-up opacity-0"
              style={{ animationDelay: '160ms', animationFillMode: 'forwards' }}
            >
              Sube un archivo CSV o XLSX y deja que la IA genere visualizaciones por ti
            </p>
          </div>

          {/* CTA Button */}
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}
          >
            <Button
              onClick={handleCreateWorkspace}
              size="lg"
              aria-label="Crear un nuevo dashboard"
              className="relative bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-0.5 group overflow-hidden px-8 py-6 text-base rounded-xl cursor-pointer"
            >
              <Sparkles className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Crear Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              {/* Animated bottom bar on hover */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-foreground/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>

          {/* Feature pills */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up opacity-0"
            style={{ animationDelay: '360ms', animationFillMode: 'forwards' }}
          >
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render view based on workspace status
  switch (workspace.status) {
    case 'empty':
    case 'prompted':
    case 'error':
      return <PromptView workspaceId={workspace.id} />

    case 'selecting':
    case 'building':
      return <SelectionView workspaceId={workspace.id} />

    case 'ready':
      return (
        <div className="h-full overflow-hidden">
          <DashboardView workspaceId={workspace.id} />
        </div>
      )

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Estado desconocido</p>
        </div>
      )
  }
}
