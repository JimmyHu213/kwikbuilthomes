export type PlannerTool = 'select' | 'move' | 'rotate' | 'delete'

export type PlacingProduct = {
  productId: number | string
  slug: string
  title: string
  sceneTemplate: SceneTemplate
}

export type SceneTemplate = {
  nodes: Record<string, unknown>
  rootNodeIds: string[]
}

export type PlannedModule = {
  /** The root node ID in the scene store */
  rootNodeId: string
  productId: number | string
  productTitle: string
  productSlug: string
  floorArea: number | null
  dimensions: { length: number; width: number } | null
  priceFrom: number | null
}

export type BomLineItem = {
  productId: number | string
  productTitle: string
  productSlug: string
  quantity: number
  unitDimensions: string
  unitFloorArea: number | null
  unitPriceFrom: number | null
  totalFloorArea: number | null
}

export type LayoutBom = {
  lineItems: BomLineItem[]
  totalModules: number
  totalFloorArea: number
  estimatedPriceFrom: number | null
}

export type ProductForPlanner = {
  id: number | string
  title: string
  slug: string
  dimensions: { length?: number | null; width?: number | null; height?: number | null } | null
  floorArea?: number | null
  priceRange: { from?: number | null; to?: number | null; label?: string | null } | null
  templateThumbnailUrl: string | null
  hasSceneTemplate: boolean
}
