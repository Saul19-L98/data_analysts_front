import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useWorkspaceStore } from '@/features/workspaces/stores/useWorkspaceStore'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'

export function NavWorkspaces() {
  const {
    workspaces,
    activeWorkspaceId,
    addWorkspace,
    removeWorkspace,
    renameWorkspace,
    setActiveWorkspace,
  } = useWorkspaceStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleAdd = () => {
    addWorkspace()
  }

  const handleEdit = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      removeWorkspace(id)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarGroupAction title="Agregar Workspace" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Agregar Workspace</span>
          </SidebarGroupAction>
        </TooltipTrigger>
        {/* <TooltipContent side="right">
          <p>Agregar Workspace</p>
        </TooltipContent> */}
      </Tooltip>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <SidebarMenuItem 
              key={workspace.id} 
              className="group"
              onMouseEnter={() => setHoveredId(workspace.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {editingId === workspace.id ? (
                <div className="px-2 py-1">
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveEdit(workspace.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(workspace.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="h-8"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className="relative">
                  <SidebarMenuButton
                    onClick={() => setActiveWorkspace(workspace.id)}
                    isActive={activeWorkspaceId === workspace.id}
                  >
                    <span className="truncate pr-16">{workspace.name}</span>
                  </SidebarMenuButton>
                  
                  {/* Gradient fade overlay */}
                  <div 
                    className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-sidebar to-transparent transition-opacity pointer-events-none z-[5] ${
                      hoveredId === workspace.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  
                  {/* Action buttons */}
                  <div 
                    className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity z-10 ${
                      hoveredId === workspace.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      title="Editar"
                      className="p-1.5 hover:bg-sidebar-accent rounded-md bg-sidebar shadow-sm border border-sidebar-border cursor-pointer"
                      onClick={(e) => handleEdit(workspace.id, workspace.name, e)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Editar</span>
                    </button>

                    <button
                      title="Eliminar"
                      className="p-1.5 hover:bg-sidebar-accent rounded-md bg-sidebar shadow-sm border border-sidebar-border cursor-pointer"
                      onClick={(e) => handleDelete(workspace.id, workspace.name, e)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </div>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
