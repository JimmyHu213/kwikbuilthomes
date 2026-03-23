import { describe, it, expect } from 'vitest'
import {
  extractOptionData,
  computeConfigTotal,
  buildQuoteUrl,
  type OptionCardData,
  type OptionCategoryData,
} from '@/lib/configuration'
import type { Media, Product } from '@/payload-types'

const mockMedia = (overrides: Partial<Media> = {}): Media => ({
  id: 1,
  alt: 'Option image',
  url: 'https://example.public.blob.vercel-storage.com/option-1.jpg',
  thumbnailURL: null,
  width: 800,
  height: 600,
  sizes: {
    thumbnail: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    card: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    hero: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
  },
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  filename: 'option-1.jpg',
  mimeType: 'image/jpeg',
  filesize: 51200,
  focalX: null,
  focalY: null,
  ...overrides,
})

describe('extractOptionData', () => {
  it('transforms CMS optionCategories into OptionCategoryData[]', () => {
    const categories: Product['optionCategories'] = [
      {
        id: 'cat-1',
        categoryName: 'Cladding',
        selectionType: 'single',
        options: [
          {
            id: 'opt-1',
            name: 'Colorbond Steel',
            description: 'Durable steel cladding',
            image: mockMedia({ id: 1, alt: 'Colorbond' }),
            priceModifier: 0,
          },
          {
            id: 'opt-2',
            name: 'Timber Weatherboard',
            description: 'Classic timber finish',
            image: mockMedia({ id: 2, alt: 'Timber', url: 'https://example.com/timber.jpg' }),
            priceModifier: 2500,
          },
        ],
      },
    ]

    const result = extractOptionData(categories)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'cat-1',
      categoryName: 'Cladding',
      selectionType: 'single',
      options: [
        {
          id: 'opt-1',
          name: 'Colorbond Steel',
          description: 'Durable steel cladding',
          imageUrl: 'https://example.public.blob.vercel-storage.com/option-1.jpg',
          imageAlt: 'Colorbond',
          priceModifier: 0,
        },
        {
          id: 'opt-2',
          name: 'Timber Weatherboard',
          description: 'Classic timber finish',
          imageUrl: 'https://example.com/timber.jpg',
          imageAlt: 'Timber',
          priceModifier: 2500,
        },
      ],
    })
  })

  it('filters out categories with no options', () => {
    const categories: Product['optionCategories'] = [
      {
        id: 'cat-1',
        categoryName: 'Cladding',
        selectionType: 'single',
        options: [
          { id: 'opt-1', name: 'Colorbond Steel', priceModifier: 0 },
        ],
      },
      {
        id: 'cat-2',
        categoryName: 'Empty Category',
        selectionType: 'single',
        options: [],
      },
      {
        id: 'cat-3',
        categoryName: 'Null Options',
        selectionType: 'multiple',
        options: null,
      },
    ]

    const result = extractOptionData(categories)
    expect(result).toHaveLength(1)
    expect(result[0].categoryName).toBe('Cladding')
  })

  it('handles null, undefined, and empty inputs', () => {
    expect(extractOptionData(null)).toEqual([])
    expect(extractOptionData(undefined)).toEqual([])
    expect(extractOptionData([])).toEqual([])
  })

  it('uses opt.id ?? opt.name for stable IDs', () => {
    const categories: Product['optionCategories'] = [
      {
        categoryName: 'Kitchen',
        options: [
          { name: 'Standard Kitchen', priceModifier: 0 },
          { id: 'custom-id', name: 'Premium Kitchen', priceModifier: 5000 },
        ],
      },
    ]

    const result = extractOptionData(categories)
    expect(result[0].id).toBe('Kitchen') // categoryName used when id is absent
    expect(result[0].selectionType).toBe('single') // defaults to single
    expect(result[0].options[0].id).toBe('Standard Kitchen') // name used when id is absent
    expect(result[0].options[1].id).toBe('custom-id') // id used when present
  })

  it('extracts imageUrl via getMediaUrl and imageAlt via getMediaAlt with fallback to opt.name', () => {
    const categories: Product['optionCategories'] = [
      {
        id: 'cat-1',
        categoryName: 'Finishes',
        options: [
          {
            id: 'opt-1',
            name: 'Premium Timber',
            image: mockMedia({ alt: 'Timber finish photo' }),
            priceModifier: 1000,
          },
          {
            id: 'opt-2',
            name: 'Basic Paint',
            image: null,
            priceModifier: 0,
          },
          {
            id: 'opt-3',
            name: 'Unpopulated Ref',
            image: 42, // unpopulated number ID
            priceModifier: 500,
          },
        ],
      },
    ]

    const result = extractOptionData(categories)
    // Populated image: uses getMediaAlt
    expect(result[0].options[0].imageUrl).toBe('https://example.public.blob.vercel-storage.com/option-1.jpg')
    expect(result[0].options[0].imageAlt).toBe('Timber finish photo')

    // Null image: null URL, falls back to opt.name for alt
    expect(result[0].options[1].imageUrl).toBeNull()
    expect(result[0].options[1].imageAlt).toBe('Basic Paint')

    // Number image (unpopulated): null URL, falls back to opt.name for alt
    expect(result[0].options[2].imageUrl).toBeNull()
    expect(result[0].options[2].imageAlt).toBe('Unpopulated Ref')
  })
})

describe('computeConfigTotal', () => {
  const categories: OptionCategoryData[] = [
    {
      id: 'cladding',
      categoryName: 'Cladding',
      selectionType: 'single',
      options: [
        { id: 'steel', name: 'Colorbond Steel', description: null, imageUrl: null, imageAlt: 'Steel', priceModifier: 0 },
        { id: 'timber', name: 'Timber', description: null, imageUrl: null, imageAlt: 'Timber', priceModifier: 2500 },
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

  it('sums selected price modifiers correctly', () => {
    const selections: Record<string, string[]> = {
      cladding: ['timber'],
      extras: ['deck', 'carport'],
    }
    expect(computeConfigTotal(selections, categories)).toBe(15500)
  })

  it('returns 0 when no selections exist', () => {
    expect(computeConfigTotal({}, categories)).toBe(0)
  })

  it('ignores selections for category IDs not found in categories', () => {
    const selections: Record<string, string[]> = {
      'nonexistent-category': ['some-option'],
      cladding: ['timber'],
    }
    expect(computeConfigTotal(selections, categories)).toBe(2500)
  })

  it('treats null/undefined priceModifier as 0', () => {
    const selections: Record<string, string[]> = {
      extras: ['solar', 'deck'],
    }
    // solar has null priceModifier, deck has 8000
    expect(computeConfigTotal(selections, categories)).toBe(8000)
  })

  it('handles mixed: some selected options have modifiers, some do not', () => {
    const selections: Record<string, string[]> = {
      cladding: ['steel'], // priceModifier: 0
      extras: ['solar'],   // priceModifier: null
    }
    expect(computeConfigTotal(selections, categories)).toBe(0)
  })
})

describe('buildQuoteUrl', () => {
  it('serializes selections into URL search params', () => {
    const selections: Record<string, string[]> = {
      cladding: ['timber'],
      extras: ['deck', 'carport'],
    }
    const url = buildQuoteUrl('kwikbuilt-studio-35', selections)
    expect(url).toContain('/quote/kwikbuilt-studio-35')
    expect(url).toContain('opt_cladding=timber')
    expect(url).toContain('opt_extras=deck%2Ccarport')
  })

  it('returns path without params when selections is empty', () => {
    const url = buildQuoteUrl('kwikbuilt-studio-35', {})
    expect(url).toBe('/quote/kwikbuilt-studio-35')
  })

  it('handles single selection per category', () => {
    const selections: Record<string, string[]> = {
      cladding: ['steel'],
    }
    const url = buildQuoteUrl('my-product', selections)
    expect(url).toBe('/quote/my-product?opt_cladding=steel')
  })
})
