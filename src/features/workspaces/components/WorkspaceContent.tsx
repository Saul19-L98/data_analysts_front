import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { PromptView } from './PromptView'
import { SelectionView } from './SelectionView'
import { DashboardView } from './DashboardView'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

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
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Bienvenido a Data Helper
            </h2>
            <p className="text-lg text-muted-foreground">
              Crea un nuevo workspace para comenzar a analizar tus datos con IA
            </p>
          </div>
          
          <Button 
            onClick={handleCreateWorkspace}
            size="lg"
            className="relative bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 hover:-translate-y-0.5 group overflow-hidden"
          >
            {/* Animated bar on hover */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-foreground/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            
            <Sparkles className="mr-2 h-5 w-5" />
            <span>Crear Dashboard</span>
          </Button>
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
        <div className="h-full overflow-hidden ">
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
