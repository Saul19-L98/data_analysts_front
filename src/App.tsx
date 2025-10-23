import { useEffect } from 'react'
import { Sidebar } from '@/features/workspaces/components/Sidebar'
import { WorkspaceContent } from '@/features/workspaces/components/WorkspaceContent'
import { validateEnv } from '@/lib/env'

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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <WorkspaceContent />
      </main>
    </div>
  )
}

export default App
