import { describe, it, expect } from 'vitest'
import type { OptionCategoryData } from '@/lib/configuration'
import { computeConfigTotal } from '@/lib/configuration'
import { toggleSingle, toggleMultiple, hasSelections } from '../../(frontend)/components/product-configurator'

// --- Fixtures ---

const mockCategories: OptionCategoryData[] = [
  {
    id: 'cladding',
    categoryName: 'Cladding',
    selectionType: 'single',
    options: [
      { id: 'steel', name: 'Colorbond Steel', description: null, imageUrl: null, imageAlt: 'Steel', priceModifier: 0 },
      { id: 'timber', name: 'Timber Weatherboard', description: null, imageUrl: null, imageAlt: 'Timber', priceModifier: 2500 },
      { id: 'brick', name: 'Brick Veneer', description: null, imageUrl: null, imageAlt: 'Brick', priceModifier: 4000 },
    ],
  },
  {
    id: 'extras',
    categoryName: 'Extras',
    selectionType: 'multiple',
    options: [
      { id: 'deck', name: 'Deck', description: null, imageUrl: null, imageAlt: 'Deck', priceModifier: 8000 },
      { id: 'carport', name: 'Carport', description: null, imageUrl: null, imageAlt: 'Carport', priceModifier: 5000 },
      { id: 'solar', name: 'Solar Panels', description: null, imageUrl: null, imageAlt: 'Solar', priceModifier: null },
    ],
  },
]

// --- Selection Logic Tests ---

describe('toggleSingle', () => {
  it('selects an option as the only selection for a category', () => {
    const selections: Record<string, string[]> = {}
    const result = toggleSingle(selections, 'cladding', 'steel')
    expect(result).toEqual({ cladding: ['steel'] })
  })

  it('deselects an option when selecting the same one again (toggle-off)', () => {
    const selections: Record<string, string[]> = { cladding: ['steel'] }
    const result = toggleSingle(selections, 'cladding', 'steel')
    expect(result.cladding).toBeUndefined()
  })

  it('replaces the previous selection when selecting a different option in the same category', () => {
    const selections: Record<string, string[]> = { cladding: ['steel'] }
    const result = toggleSingle(selections, 'cladding', 'timber')
    expect(result).toEqual({ cladding: ['timber'] })
  })

  it('preserves selections in other categories', () => {
    const selections: Record<string, string[]> = { cladding: ['steel'], extras: ['deck'] }
    const result = toggleSingle(selections, 'cladding', 'timber')
    expect(result).toEqual({ cladding: ['timber'], extras: ['deck'] })
  })
})

describe('toggleMultiple', () => {
  it('adds an option to the category selections', () => {
    const selections: Record<string, string[]> = {}
    const result = toggleMultiple(selections, 'extras', 'deck')
    expect(result).toEqual({ extras: ['deck'] })
  })

  it('removes an already-selected option', () => {
    const selections: Record<string, string[]> = { extras: ['deck', 'carport'] }
    const result = toggleMultiple(selections, 'extras', 'deck')
    expect(result).toEqual({ extras: ['carport'] })
  })

  it('cleans up the category key when last option is removed', () => {
    const selections: Record<string, string[]> = { extras: ['deck'] }
    const result = toggleMultiple(selections, 'extras', 'deck')
    expect(result.extras).toBeUndefined()
  })

  it('preserves selections in other categories', () => {
    const selections: Record<string, string[]> = { cladding: ['steel'], extras: ['deck'] }
    const result = toggleMultiple(selections, 'extras', 'carport')
    expect(result).toEqual({ cladding: ['steel'], extras: ['deck', 'carport'] })
  })
})

describe('hasSelections', () => {
  it('returns false when selections is empty', () => {
    expect(hasSelections({})).toBe(false)
  })

  it('returns true when any selection exists', () => {
    expect(hasSelections({ cladding: ['steel'] })).toBe(true)
  })

  it('returns false when all categories have empty arrays', () => {
    // This should not normally occur due to cleanup, but test for safety
    expect(hasSelections({ cladding: [] })).toBe(false)
  })
})

describe('computeConfigTotal with real category data', () => {
  it('sums correctly across single and multi-select categories', () => {
    const selections: Record<string, string[]> = {
      cladding: ['timber'],
      extras: ['deck', 'carport'],
    }
    expect(computeConfigTotal(selections, mockCategories)).toBe(15500)
  })

  it('returns 0 when only included (zero-price) options are selected', () => {
    const selections: Record<string, string[]> = {
      cladding: ['steel'],
      extras: ['solar'],
    }
    expect(computeConfigTotal(selections, mockCategories)).toBe(0)
  })
})
