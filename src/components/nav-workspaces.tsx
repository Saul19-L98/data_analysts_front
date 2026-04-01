import { Plus, Pencil, Trash2, EllipsisVertical } from 'lucide-react'
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleAdd = () => {
    addWorkspace()
  }

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpenId(null)
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
    setMenuOpenId(null)
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      removeWorkspace(id)
    }
  }

  const handleToggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpenId((prev) => (prev === id ? null : id))
  }

  const handleMouseEnter = (id: string) => {
    setHoveredId(id)
  }

  const handleMouseLeave = (id: string) => {
    setHoveredId((prev) => (prev === id ? null : prev))
    setMenuOpenId((prev) => (prev === id ? null : prev))
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
      </Tooltip>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => {
            const isHovered = hoveredId === workspace.id
            const isMenuOpen = menuOpenId === workspace.id
            const isEditing = editingId === workspace.id

            return (
              <SidebarMenuItem
                key={workspace.id}
                onMouseEnter={() => handleMouseEnter(workspace.id)}
                onMouseLeave={() => handleMouseLeave(workspace.id)}
              >
                {isEditing ? (
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
                      aria-current={activeWorkspaceId === workspace.id ? 'page' : undefined}
                      className={activeWorkspaceId === workspace.id ? 'relative before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-0.5 before:bg-primary before:rounded-full' : ''}
                    >
                      <span className="truncate pr-10">{workspace.name}</span>
                    </SidebarMenuButton>

                    {/* Step 1: "Editar" trigger — visible on hover */}
                    {isHovered && !isMenuOpen && (
                      <>
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-sidebar to-transparent pointer-events-none z-[5]" />
                        <button
                          aria-label="Opciones del workspace"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                          onClick={(e) => handleToggleMenu(workspace.id, e)}
                        >
                          <EllipsisVertical className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {/* Step 2: Sub-menu — visible after clicking the trigger */}
                    {isMenuOpen && (
                      <>
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-sidebar to-transparent pointer-events-none z-[5]" />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 animate-scale-in">
                          <button
                            aria-label="Editar nombre del workspace"
                            title="Editar"
                            className="p-1.5 hover:bg-sidebar-accent rounded-md bg-sidebar shadow-sm border border-sidebar-border cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
                            onClick={(e) => handleStartRename(workspace.id, workspace.name, e)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            aria-label="Eliminar workspace"
                            title="Eliminar"
                            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md bg-sidebar shadow-sm border border-sidebar-border cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
                            onClick={(e) => handleDelete(workspace.id, workspace.name, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
