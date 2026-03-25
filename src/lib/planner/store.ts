import { create } from 'zustand'
import type { PlannerTool, PlacingProduct, PlannedModule } from './types'

type PlannerState = {
  tool: PlannerTool
  setTool: (tool: PlannerTool) => void
  placingProduct: PlacingProduct | null
  setPlacingProduct: (product: PlacingProduct | null) => void
  modules: Map<string, PlannedModule>
  addModule: (module: PlannedModule) => void
  removeModule: (rootNodeId: string) => void
  clearModules: () => void
  getModulesArray: () => PlannedModule[]
  selectedModuleId: string | null
  setSelectedModuleId: (id: string | null) => void
  cameraMode: 'orthographic' | 'perspective'
  toggleCameraMode: () => void
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  tool: 'select',
  setTool: (tool) => set({ tool }),
  placingProduct: null,
  setPlacingProduct: (product) => set({ placingProduct: product }),
  modules: new Map(),
  addModule: (module) =>
    set((state) => {
      const next = new Map(state.modules)
      next.set(module.rootNodeId, module)
      return { modules: next }
    }),
  removeModule: (rootNodeId) =>
    set((state) => {
      const next = new Map(state.modules)
      next.delete(rootNodeId)
      return { modules: next, selectedModuleId: state.selectedModuleId === rootNodeId ? null : state.selectedModuleId }
    }),
  clearModules: () => set({ modules: new Map(), selectedModuleId: null }),
  getModulesArray: () => Array.from(get().modules.values()),
  selectedModuleId: null,
  setSelectedModuleId: (id) => set({ selectedModuleId: id }),
  cameraMode: 'orthographic',
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === 'orthographic' ? 'perspective' : 'orthographic',
    })),
}))
