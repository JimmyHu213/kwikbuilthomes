'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type * as THREE from 'three'
import { usePlannerStore } from '@/lib/planner/store'

const GRID_SNAP = 0.5

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP
}

export function PlacementGhost() {
  const groupRef = useRef<THREE.Group>(null)
  const placingProduct = usePlannerStore((s) => s.placingProduct)
  const { raycaster, pointer, camera } = useThree()

  useFrame(() => {
    if (!groupRef.current || !placingProduct) return
    raycaster.setFromCamera(pointer, camera)
    const direction = raycaster.ray.direction
    const origin = raycaster.ray.origin
    if (Math.abs(direction.y) < 0.001) return
    const t = -origin.y / direction.y
    if (t < 0) return
    const x = snapToGrid(origin.x + direction.x * t)
    const z = snapToGrid(origin.z + direction.z * t)
    groupRef.current.position.set(x, 0, z)
  })

  if (!placingProduct) return null

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#C8962E" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
