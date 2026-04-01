import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceStore } from '@/features/workspaces/stores/useWorkspaceStore'
import { ChevronRight } from 'lucide-react'

export function SiteHeader() {
  const workspace = useWorkspaceStore((s) => s.getActiveWorkspace())

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-foreground">Data Helper</span>
        {workspace && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground truncate max-w-[200px]">
              {workspace.name}
            </span>
          </>
        )}
      </nav>
    </header>
  )
}
