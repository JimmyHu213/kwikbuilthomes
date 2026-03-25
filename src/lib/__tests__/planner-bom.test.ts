import { describe, it, expect } from 'vitest'
import { buildBom } from '../planner/bom'
import type { PlannedModule } from '../planner/types'

describe('buildBom', () => {
  it('groups modules by product and sums quantities', () => {
    const modules: PlannedModule[] = [
      { rootNodeId: 'a', productId: 1, productTitle: 'KBH-3B2B', productSlug: 'kbh-3b2b', floorArea: 42, dimensions: { length: 12000, width: 3500 }, priceFrom: 120000 },
      { rootNodeId: 'b', productId: 1, productTitle: 'KBH-3B2B', productSlug: 'kbh-3b2b', floorArea: 42, dimensions: { length: 12000, width: 3500 }, priceFrom: 120000 },
      { rootNodeId: 'c', productId: 2, productTitle: 'KBH-Studio', productSlug: 'kbh-studio', floorArea: 21, dimensions: { length: 6000, width: 3500 }, priceFrom: 65000 },
    ]
    const bom = buildBom(modules)
    expect(bom.lineItems).toHaveLength(2)
    expect(bom.totalModules).toBe(3)
    expect(bom.totalFloorArea).toBe(105)
    const line1 = bom.lineItems.find((l) => l.productId === 1)!
    expect(line1.quantity).toBe(2)
    expect(line1.totalFloorArea).toBe(84)
    const line2 = bom.lineItems.find((l) => l.productId === 2)!
    expect(line2.quantity).toBe(1)
  })

  it('calculates estimated price from sum of priceFrom values', () => {
    const modules: PlannedModule[] = [
      { rootNodeId: 'a', productId: 1, productTitle: 'A', productSlug: 'a', floorArea: 40, dimensions: null, priceFrom: 100000 },
      { rootNodeId: 'b', productId: 2, productTitle: 'B', productSlug: 'b', floorArea: 20, dimensions: null, priceFrom: 50000 },
    ]
    const bom = buildBom(modules)
    expect(bom.estimatedPriceFrom).toBe(150000)
  })

  it('returns null estimatedPriceFrom when any module has no price', () => {
    const modules: PlannedModule[] = [
      { rootNodeId: 'a', productId: 1, productTitle: 'A', productSlug: 'a', floorArea: 40, dimensions: null, priceFrom: 100000 },
      { rootNodeId: 'b', productId: 2, productTitle: 'B', productSlug: 'b', floorArea: 20, dimensions: null, priceFrom: null },
    ]
    const bom = buildBom(modules)
    expect(bom.estimatedPriceFrom).toBeNull()
  })

  it('returns empty BOM for no modules', () => {
    const bom = buildBom([])
    expect(bom.lineItems).toHaveLength(0)
    expect(bom.totalModules).toBe(0)
    expect(bom.totalFloorArea).toBe(0)
  })

  it('formats unit dimensions as meters', () => {
    const modules: PlannedModule[] = [
      { rootNodeId: 'a', productId: 1, productTitle: 'A', productSlug: 'a', floorArea: 42, dimensions: { length: 12000, width: 3500 }, priceFrom: null },
    ]
    const bom = buildBom(modules)
    expect(bom.lineItems[0].unitDimensions).toBe('12.0m x 3.5m')
  })
})
