import { useEffect } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { WorkspaceContent } from '@/features/workspaces/components/WorkspaceContent'
import { validateEnv } from '@/lib/env'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  useEffect(() => {
    try {
      validateEnv()
    } catch (error) {
      console.error(error)
      alert(
        'Error: Faltan variables de entorno requeridas. ' +
        'Por favor configura VITE_AGENT_ID y VITE_AGENT_ALIAS_ID en tu archivo .env'
      )
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SidebarProvider
          className="h-screen"
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset className="h-screen overflow-hidden">
            <SiteHeader />
            <div className="flex-1 min-h-0">
              <WorkspaceContent />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
