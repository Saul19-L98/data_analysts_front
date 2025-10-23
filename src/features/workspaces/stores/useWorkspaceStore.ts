import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Workspace, SuggestedChart, ChartBuilt, WorkspaceStatus } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Workspace store state
 */
interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
}

/**
 * Workspace store actions
 */
interface WorkspaceActions {
  addWorkspace: () => string
  removeWorkspace: (id: string) => void
  renameWorkspace: (id: string, name: string) => void
  setActiveWorkspace: (id: string | null) => void
  updateWorkspaceStatus: (id: string, status: WorkspaceStatus) => void
  setWorkspaceSession: (
    id: string,
    sessionId: string,
    dataset: Record<string, unknown>[],
    suggested: SuggestedChart[]
  ) => void
  setSelectedCharts: (id: string, selected: SuggestedChart[]) => void
  setWorkspaceCharts: (id: string, charts: ChartBuilt[]) => void
  updateChartTitle: (workspaceId: string, chartId: string, title: string) => void
  getActiveWorkspace: () => Workspace | null
  getWorkspace: (id: string) => Workspace | undefined
}

type WorkspaceStore = WorkspaceState & WorkspaceActions

/**
 * Zustand store for workspace management with localStorage persistence
 */
export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,

      addWorkspace: () => {
        const id = generateId()
        const workspaceCount = get().workspaces.length + 1
        const newWorkspace: Workspace = {
          id,
          name: `Workspace ${workspaceCount}`,
          status: 'empty',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          activeWorkspaceId: id,
        }))

        return id
      },

      removeWorkspace: (id: string) => {
        set((state) => {
          const newWorkspaces = state.workspaces.filter((w) => w.id !== id)
          const newActiveId =
            state.activeWorkspaceId === id
              ? newWorkspaces[0]?.id || null
              : state.activeWorkspaceId

          return {
            workspaces: newWorkspaces,
            activeWorkspaceId: newActiveId,
          }
        })
      },

      renameWorkspace: (id: string, name: string) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, name, updatedAt: Date.now() } : w
          ),
        }))
      },

      setActiveWorkspace: (id: string | null) => {
        set({ activeWorkspaceId: id })
      },

      updateWorkspaceStatus: (id: string, status: WorkspaceStatus) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, status, updatedAt: Date.now() } : w
          ),
        }))
      },

      setWorkspaceSession: (
        id: string,
        sessionId: string,
        dataset: Record<string, unknown>[],
        suggested: SuggestedChart[]
      ) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id
              ? {
                  ...w,
                  sessionId,
                  dataset,
                  selected: suggested,
                  status: 'selecting' as WorkspaceStatus,
                  updatedAt: Date.now(),
                }
              : w
          ),
        }))
      },

      setSelectedCharts: (id: string, selected: SuggestedChart[]) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, selected, updatedAt: Date.now() } : w
          ),
        }))
      },

      setWorkspaceCharts: (id: string, charts: ChartBuilt[]) => {
        // Ensure all charts have unique IDs (backend might not provide them)
        const chartsWithIds = charts.map((chart) => ({
          ...chart,
          id: chart.id || generateId(),
        }))
        
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id
              ? {
                  ...w,
                  charts: chartsWithIds,
                  status: 'ready' as WorkspaceStatus,
                  updatedAt: Date.now(),
                }
              : w
          ),
        }))
      },

      updateChartTitle: (workspaceId: string, chartId: string, title: string) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  charts: w.charts?.map((c) =>
                    c.id === chartId ? { ...c, title } : c
                  ),
                  updatedAt: Date.now(),
                }
              : w
          ),
        }))
      },

      getActiveWorkspace: () => {
        const state = get()
        return state.workspaces.find((w) => w.id === state.activeWorkspaceId) || null
      },

      getWorkspace: (id: string) => {
        return get().workspaces.find((w) => w.id === id)
      },
    }),
    {
      name: 'data-helper-workspaces',
      partialize: (state) => ({
        // Only persist workspaces with status 'ready' (built dashboards)
        workspaces: state.workspaces.filter((w) => w.status === 'ready'),
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
)
