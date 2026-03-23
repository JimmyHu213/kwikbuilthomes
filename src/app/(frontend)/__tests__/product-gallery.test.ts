import { describe, it, expect } from 'vitest'
import { extractGallerySlides } from '@/lib/gallery'
import type { Media, Product } from '@/payload-types'

const mockMedia = (overrides: Partial<Media> = {}): Media => ({
  id: 1,
  alt: 'Gallery image',
  url: 'https://example.public.blob.vercel-storage.com/gallery-1.jpg',
  thumbnailURL: null,
  width: 1200,
  height: 800,
  sizes: {
    thumbnail: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    card: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
    hero: { url: null, width: null, height: null, mimeType: null, filesize: null, filename: null },
  },
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  filename: 'gallery-1.jpg',
  mimeType: 'image/jpeg',
  filesize: 102400,
  focalX: null,
  focalY: null,
  ...overrides,
})

describe('extractGallerySlides', () => {
  it('filters out unpopulated images (where image is a number)', () => {
    const gallery: Product['gallery'] = [
      { image: 42, caption: 'Unpopulated', category: 'exterior', id: '1' },
      { image: mockMedia({ id: 2, alt: 'Exterior view' }), caption: 'Front view', category: 'exterior', id: '2' },
    ]

    const slides = extractGallerySlides(gallery)
    expect(slides).toHaveLength(1)
    expect(slides[0].alt).toBe('Exterior view')
  })

  it('maps populated gallery items to slide objects', () => {
    const gallery: Product['gallery'] = [
      {
        image: mockMedia({ id: 1, alt: 'Living room', url: 'https://example.com/living.jpg', width: 1600, height: 1000 }),
        caption: 'Spacious living area',
        category: 'interior',
        id: '1',
      },
      {
        image: mockMedia({ id: 2, alt: 'Kitchen', url: 'https://example.com/kitchen.jpg', width: 1400, height: 900 }),
        caption: 'Modern kitchen',
        category: 'interior',
        id: '2',
      },
    ]

    const slides = extractGallerySlides(gallery)
    expect(slides).toHaveLength(2)
    expect(slides[0]).toEqual({
      src: 'https://example.com/living.jpg',
      alt: 'Living room',
      width: 1600,
      height: 1000,
      caption: 'Spacious living area',
      category: 'interior',
    })
    expect(slides[1]).toEqual({
      src: 'https://example.com/kitchen.jpg',
      alt: 'Kitchen',
      width: 1400,
      height: 900,
      caption: 'Modern kitchen',
      category: 'interior',
    })
  })

  it('returns empty array when gallery is null or undefined', () => {
    expect(extractGallerySlides(null)).toEqual([])
    expect(extractGallerySlides(undefined)).toEqual([])
  })

  it('returns empty array when gallery items have no URL', () => {
    const gallery: Product['gallery'] = [
      {
        image: mockMedia({ url: null }),
        caption: 'No URL',
        category: 'exterior',
        id: '1',
      },
    ]

    const slides = extractGallerySlides(gallery)
    expect(slides).toEqual([])
  })
})
