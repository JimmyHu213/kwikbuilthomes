import { describe, it, expect } from 'vitest'
import { getMediaUrl } from '@/lib/media'
import { formatPrice } from '@/lib/format'
import type { Media, Document, Product } from '@/payload-types'

const mockMedia = (overrides: Partial<Media> = {}): Media => ({
  id: 1,
  alt: 'Product image',
  url: 'https://example.public.blob.vercel-storage.com/product.jpg',
  thumbnailURL: null,
  width: 1920,
  height: 1080,
  sizes: {
    thumbnail: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    card: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    hero: {
      url: 'https://example.public.blob.vercel-storage.com/product-hero.jpg',
      width: 1920,
      height: 1080,
      mimeType: null,
      filesize: null,
      filename: null,
    },
  },
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  filename: 'product.jpg',
  mimeType: 'image/jpeg',
  filesize: 204800,
  focalX: null,
  focalY: null,
  ...overrides,
})

const mockDocument = (overrides: Partial<Document> = {}): Document => ({
  id: 1,
  title: 'Structural Certificate',
  documentType: 'compliance',
  url: 'https://example.public.blob.vercel-storage.com/cert.pdf',
  filename: 'cert.pdf',
  mimeType: 'application/pdf',
  filesize: 512000,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('Product detail data contracts', () => {
  describe('Hero image', () => {
    it('populated heroImage object produces valid src via getMediaUrl', () => {
      const heroImage = mockMedia()
      const src = getMediaUrl(heroImage, 'hero')
      expect(src).toBe('https://example.public.blob.vercel-storage.com/product-hero.jpg')
    })

    it('null heroImage means no hero section rendered', () => {
      const heroImage: Product['heroImage'] = null
      const src = getMediaUrl(heroImage)
      expect(src).toBeNull()
    })
  })

  describe('Specs table', () => {
    it('insulationRating is included alongside existing spec fields', () => {
      const product: Partial<Product> = {
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 120,
        insulationRating: 'R3.5',
        nccClassification: '1a',
        windRegion: 'B',
        balRating: 'BAL-19',
        structuralSystem: 'Light gauge steel frame',
        dimensions: { length: 12, width: 10, height: 3.2 },
      }

      // All spec fields should be available for rendering
      const specs = [
        { label: 'Bedrooms', value: product.bedrooms },
        { label: 'Bathrooms', value: product.bathrooms },
        { label: 'Floor Area', value: product.floorArea ? `${product.floorArea}m\u00B2` : null },
        { label: 'Insulation', value: product.insulationRating },
        { label: 'NCC Class', value: product.nccClassification },
        { label: 'Wind Region', value: product.windRegion },
        { label: 'BAL Rating', value: product.balRating },
        { label: 'Structure', value: product.structuralSystem },
      ].filter((s) => s.value != null)

      expect(specs).toHaveLength(8)
      expect(specs.find((s) => s.label === 'Insulation')?.value).toBe('R3.5')
    })

    it('missing specs fields result in those rows not rendering', () => {
      const product: Partial<Product> = {
        bedrooms: 2,
        bathrooms: 1,
        // All other fields missing/undefined
      }

      const specs = [
        { label: 'Bedrooms', value: product.bedrooms },
        { label: 'Bathrooms', value: product.bathrooms },
        { label: 'Floor Area', value: product.floorArea ? `${product.floorArea}m\u00B2` : null },
        { label: 'Insulation', value: product.insulationRating },
        { label: 'NCC Class', value: product.nccClassification },
        { label: 'Wind Region', value: product.windRegion },
        { label: 'BAL Rating', value: product.balRating },
        { label: 'Structure', value: product.structuralSystem },
      ].filter((s) => s.value != null)

      expect(specs).toHaveLength(2)
      expect(specs.map((s) => s.label)).toEqual(['Bedrooms', 'Bathrooms'])
    })
  })

  describe('Floor plans', () => {
    it('populated floorPlans array produces image URLs and labels', () => {
      const floorPlans: Product['floorPlans'] = [
        {
          image: mockMedia({ id: 10, alt: 'Ground floor', url: 'https://example.com/ground.jpg' }),
          label: 'Ground Floor',
          id: '1',
        },
        {
          image: mockMedia({ id: 11, alt: 'First floor', url: 'https://example.com/first.jpg' }),
          label: 'First Floor',
          id: '2',
        },
      ]

      const plans = floorPlans!.map((fp) => ({
        url: getMediaUrl(fp.image),
        label: fp.label,
      })).filter((fp) => fp.url !== null)

      expect(plans).toHaveLength(2)
      expect(plans[0]).toEqual({ url: 'https://example.com/ground.jpg', label: 'Ground Floor' })
      expect(plans[1]).toEqual({ url: 'https://example.com/first.jpg', label: 'First Floor' })
    })

    it('empty/null floorPlans means no floor plans section', () => {
      const emptyPlans: Product['floorPlans'] = []
      const nullPlans: Product['floorPlans'] = undefined

      expect(emptyPlans).toHaveLength(0)
      expect(nullPlans).toBeUndefined()

      // Both cases: no floor plans section should render
      const hasFloorPlans = (plans: Product['floorPlans']) =>
        Array.isArray(plans) && plans.length > 0
      expect(hasFloorPlans(emptyPlans)).toBe(false)
      expect(hasFloorPlans(nullPlans)).toBe(false)
    })
  })

  describe('Price', () => {
    it('formatPrice produces correct "from $X + GST" format', () => {
      expect(formatPrice(89000)).toBe('from $89,000 + GST')
      expect(formatPrice(150000)).toBe('from $150,000 + GST')
    })

    it('label override takes precedence', () => {
      expect(formatPrice(89000, 'POA')).toBe('POA')
      expect(formatPrice(null, 'Contact us')).toBe('Contact us')
    })
  })

  describe('Documents / Certifications', () => {
    it('certifications with populated document objects have download URLs', () => {
      const certifications: Product['certifications'] = [
        {
          name: 'Structural Engineering Certificate',
          type: 'structural',
          document: mockDocument({ id: 5, url: 'https://example.com/structural-cert.pdf' }),
          issueDate: '2025-06-15',
          expiryDate: '2026-06-15',
          id: '1',
        },
        {
          name: 'Energy Rating',
          type: 'energy-efficiency',
          document: mockDocument({ id: 6, url: 'https://example.com/energy-rating.pdf' }),
          issueDate: '2025-08-01',
          expiryDate: null,
          id: '2',
        },
      ]

      const docs = certifications!
        .filter((cert) => cert.document && typeof cert.document === 'object')
        .map((cert) => ({
          name: cert.name,
          type: cert.type,
          url: (cert.document as Document).url,
        }))

      expect(docs).toHaveLength(2)
      expect(docs[0].url).toBe('https://example.com/structural-cert.pdf')
      expect(docs[1].url).toBe('https://example.com/energy-rating.pdf')
    })

    it('certifications with unpopulated documents (number IDs) are filtered out', () => {
      const certifications: Product['certifications'] = [
        {
          name: 'Structural Certificate',
          type: 'structural',
          document: 99, // unpopulated - just a number ID
          issueDate: '2025-06-15',
          expiryDate: null,
          id: '1',
        },
        {
          name: 'Fire Safety',
          type: 'fire-safety',
          document: null, // no document linked
          issueDate: '2025-07-01',
          expiryDate: null,
          id: '2',
        },
      ]

      const docs = certifications!
        .filter((cert) => cert.document && typeof cert.document === 'object')
        .map((cert) => ({
          name: cert.name,
          url: (cert.document as Document).url,
        }))

      expect(docs).toHaveLength(0)
    })
  })
})
