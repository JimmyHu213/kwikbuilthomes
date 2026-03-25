'use client'

import { useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { usePlannerStore } from '@/lib/planner/store'
import { cloneTemplate } from '@/lib/planner/template'
import type { PlannedModule } from '@/lib/planner/types'

const GRID_SNAP = 0.5

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP
}

type ModuleInteractionsProps = {
  onPlaceModule: (module: PlannedModule, nodes: Record<string, unknown>, rootNodeIds: string[]) => void
  onDeleteModule: (rootNodeId: string) => void
  onRotateModule: (rootNodeId: string) => void
}

export function ModuleInteractions({ onPlaceModule, onDeleteModule, onRotateModule }: ModuleInteractionsProps) {
  const { raycaster, pointer, camera, gl } = useThree()
  const store = usePlannerStore

  const handleCanvasClick = useCallback(() => {
    const { placingProduct, tool, selectedModuleId } = store.getState()

    if (placingProduct) {
      raycaster.setFromCamera(pointer, camera)
      const direction = raycaster.ray.direction
      const origin = raycaster.ray.origin
      if (Math.abs(direction.y) < 0.001) return
      const t = -origin.y / direction.y
      if (t < 0) return
      const x = snapToGrid(origin.x + direction.x * t)
      const z = snapToGrid(origin.z + direction.z * t)

      const cloned = cloneTemplate(placingProduct.sceneTemplate, [x, 0, z])
      const module: PlannedModule = {
        rootNodeId: cloned.rootNodeIds[0],
        productId: placingProduct.productId,
        productTitle: placingProduct.title,
        productSlug: placingProduct.slug,
        floorArea: null,
        dimensions: null,
        priceFrom: null,
      }
      onPlaceModule(module, cloned.nodes, cloned.rootNodeIds)
      return
    }

    if (tool === 'delete' && selectedModuleId) {
      onDeleteModule(selectedModuleId)
    }
    if (tool === 'rotate' && selectedModuleId) {
      onRotateModule(selectedModuleId)
    }
  }, [raycaster, pointer, camera, store, onPlaceModule, onDeleteModule, onRotateModule])

  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('click', handleCanvasClick)
    return () => canvas.removeEventListener('click', handleCanvasClick)
  }, [gl, handleCanvasClick])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const { selectedModuleId } = store.getState()
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedModuleId) onDeleteModule(selectedModuleId)
      }
      if (e.key === 'r' || e.key === 'R') {
        if (selectedModuleId) onRotateModule(selectedModuleId)
      }
      if (e.key === 'Escape') {
        store.getState().setPlacingProduct(null)
        store.getState().setSelectedModuleId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [store, onDeleteModule, onRotateModule])

  return null
}
