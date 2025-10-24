import { useEffect, Suspense, lazy } from 'react'
import { validateEnv } from '@/lib/env'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LoadingFallback } from '@/components/LoadingFallback'

// Lazy load components for better performance
const AppSidebar = lazy(() => import('@/components/app-sidebar').then(m => ({ default: m.AppSidebar })))
const SiteHeader = lazy(() => import('@/components/site-header').then(m => ({ default: m.SiteHeader })))
const WorkspaceContent = lazy(() => import('@/features/workspaces/components/WorkspaceContent').then(m => ({ default: m.WorkspaceContent })))

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
        <Suspense fallback={<LoadingFallback />}>
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
              <div className="flex-1 min-h-0 !px-2 md:!px-4 lg:!px-16">
                <WorkspaceContent />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Suspense>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
