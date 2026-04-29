import type { PlannedModule, LayoutBom, BomLineItem } from './types'

export function buildBom(modules: PlannedModule[]): LayoutBom {
  if (modules.length === 0) {
    return { lineItems: [], totalModules: 0, totalFloorArea: 0, estimatedPriceFrom: null }
  }

  const grouped = new Map<number | string, PlannedModule[]>()
  for (const mod of modules) {
    const existing = grouped.get(mod.productId) ?? []
    existing.push(mod)
    grouped.set(mod.productId, existing)
  }

  const lineItems: BomLineItem[] = []
  let totalFloorArea = 0
  let estimatedPriceFrom: number | null = 0

  for (const [productId, mods] of grouped) {
    const first = mods[0]
    const quantity = mods.length
    const unitFloorArea = first.floorArea
    const itemTotalFloorArea = unitFloorArea != null ? unitFloorArea * quantity : null

    if (itemTotalFloorArea != null) totalFloorArea += itemTotalFloorArea

    if (estimatedPriceFrom != null && first.priceFrom != null) {
      estimatedPriceFrom += first.priceFrom * quantity
    } else {
      estimatedPriceFrom = null
    }

    const unitDimensions =
      first.dimensions != null
        ? `${(first.dimensions.length / 1000).toFixed(1)}m x ${(first.dimensions.width / 1000).toFixed(1)}m`
        : 'N/A'

    lineItems.push({
      productId,
      productTitle: first.productTitle,
      productSlug: first.productSlug,
      quantity,
      unitDimensions,
      unitFloorArea,
      unitPriceFrom: first.priceFrom,
      totalFloorArea: itemTotalFloorArea,
    })
  }

  return { lineItems, totalModules: modules.length, totalFloorArea, estimatedPriceFrom }
}
