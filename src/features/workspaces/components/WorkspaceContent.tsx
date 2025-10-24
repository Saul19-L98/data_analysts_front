import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { PromptView } from './PromptView'
import { SelectionView } from './SelectionView'
import { DashboardView } from './DashboardView'

/**
 * Main workspace content area that renders the appropriate view
 * based on workspace status
 */
export function WorkspaceContent() {
  const { activeWorkspaceId, getActiveWorkspace } = useWorkspaceStore()
  const workspace = getActiveWorkspace()

  if (!activeWorkspaceId || !workspace) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Bienvenido a Data Helper
          </h2>
          <p className="text-muted-foreground">
            Crea un nuevo workspace para comenzar
          </p>
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
        <div className="h-full overflow-hidden !px-16">
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
