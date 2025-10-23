import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

/**
 * Sidebar component with workspace list and management
 */
export function Sidebar() {
  const { workspaces, activeWorkspaceId, addWorkspace, removeWorkspace, renameWorkspace, setActiveWorkspace } =
    useWorkspaceStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = () => {
    addWorkspace()
  }

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameWorkspace(id, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      removeWorkspace(id)
    }
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Data Helper</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={cn(
                'group relative p-3 rounded-lg cursor-pointer transition-colors',
                'hover:bg-accent',
                activeWorkspaceId === workspace.id && 'bg-accent'
              )}
              onClick={() => setActiveWorkspace(workspace.id)}
            >
              {editingId === workspace.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveEdit(workspace.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(workspace.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="w-full px-2 py-1 text-sm bg-background border border-border rounded"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate flex-1">
                    {workspace.name}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(workspace.id, workspace.name)
                      }}
                      className="p-1 hover:bg-background rounded"
                      title="Editar nombre"
                      aria-label="Editar nombre"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(workspace.id, workspace.name)
                      }}
                      className="p-1 hover:bg-destructive/10 text-destructive rounded"
                      title="Eliminar"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Agregar workspace</span>
        </button>
      </div>
    </aside>
  )
}
