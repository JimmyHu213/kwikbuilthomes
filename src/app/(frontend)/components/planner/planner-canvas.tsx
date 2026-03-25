'use client'

import { useCallback, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { usePlannerStore } from '@/lib/planner/store'
import { PlacementGhost } from './placement-ghost'
import { ModuleInteractions } from './module-interactions'
import type { PlannedModule, ProductForPlanner } from '@/lib/planner/types'

type PlannerCanvasProps = {
  products: ProductForPlanner[]
}

export function PlannerCanvas({ products }: PlannerCanvasProps) {
  const { addModule, removeModule, placingProduct, cameraMode } = usePlannerStore()
  const rotationRef = useRef<Map<string, number>>(new Map())

  const handlePlaceModule = useCallback(
    (module: PlannedModule, nodes: Record<string, unknown>, rootNodeIds: string[]) => {
      const product = products.find((p) => p.id === module.productId)
      const enrichedModule: PlannedModule = {
        ...module,
        floorArea: product?.floorArea ?? null,
        dimensions:
          product?.dimensions?.length != null && product?.dimensions?.width != null
            ? { length: product.dimensions.length, width: product.dimensions.width }
            : null,
        priceFrom: product?.priceRange?.from ?? null,
      }
      addModule(enrichedModule)
    },
    [addModule, products],
  )

  const handleDeleteModule = useCallback(
    (rootNodeId: string) => {
      removeModule(rootNodeId)
      rotationRef.current.delete(rootNodeId)
    },
    [removeModule],
  )

  const handleRotateModule = useCallback((_rootNodeId: string) => {
    // Rotation logic will be connected when useScene integration is wired
  }, [])

  return (
    <div className="flex-1 relative" style={{ cursor: placingProduct ? 'crosshair' : 'default' }}>
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          {cameraMode === 'orthographic' ? (
            <OrthographicCamera makeDefault position={[0, 50, 0]} rotation={[-Math.PI / 2, 0, 0]} zoom={20} />
          ) : (
            <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={50} />
          )}
          <OrbitControls
            enableRotate={cameraMode === 'perspective'}
            enablePan
            enableZoom
            mouseButtons={{ LEFT: undefined, MIDDLE: 2, RIGHT: 2 }}
          />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} />
          <Grid
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#444"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#666"
            fadeDistance={50}
            infiniteGrid
          />
          <PlacementGhost />
          <ModuleInteractions
            onPlaceModule={handlePlaceModule}
            onDeleteModule={handleDeleteModule}
            onRotateModule={handleRotateModule}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
