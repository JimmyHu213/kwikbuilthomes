import { describe, it, expect } from 'vitest'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import type { Media } from '@/payload-types'

const mockMedia: Media = {
  id: 1,
  alt: 'A beautiful modular home',
  url: 'https://example.public.blob.vercel-storage.com/hero.jpg',
  thumbnailURL: 'https://example.public.blob.vercel-storage.com/hero-thumb.jpg',
  width: 1920,
  height: 1080,
  sizes: {
    thumbnail: {
      url: 'https://example.public.blob.vercel-storage.com/hero-thumbnail.jpg',
      width: 300,
      height: 200,
      mimeType: null,
      filesize: null,
      filename: null,
    },
    card: {
      url: 'https://example.public.blob.vercel-storage.com/hero-card.jpg',
      width: 768,
      height: 512,
      mimeType: null,
      filesize: null,
      filename: null,
    },
    hero: {
      url: 'https://example.public.blob.vercel-storage.com/hero-hero.jpg',
      width: 1920,
      height: 1080,
      mimeType: null,
      filesize: null,
      filename: null,
    },
  },
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  filename: 'hero.jpg',
  mimeType: 'image/jpeg',
  filesize: 204800,
  focalX: null,
  focalY: null,
}

describe('getMediaUrl', () => {
  it('returns media.url for populated Media with no size specified', () => {
    expect(getMediaUrl(mockMedia)).toBe(
      'https://example.public.blob.vercel-storage.com/hero.jpg',
    )
  })

  it('returns thumbnail size URL when size is "thumbnail"', () => {
    expect(getMediaUrl(mockMedia, 'thumbnail')).toBe(
      'https://example.public.blob.vercel-storage.com/hero-thumbnail.jpg',
    )
  })

  it('returns hero size URL when size is "hero"', () => {
    expect(getMediaUrl(mockMedia, 'hero')).toBe(
      'https://example.public.blob.vercel-storage.com/hero-hero.jpg',
    )
  })

  it('returns null for unpopulated relationship (number ID)', () => {
    expect(getMediaUrl(42)).toBeNull()
  })

  it('returns null for null', () => {
    expect(getMediaUrl(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(getMediaUrl(undefined)).toBeNull()
  })

  it('returns null for Media with no url', () => {
    const noUrlMedia: Media = {
      ...mockMedia,
      url: null,
      sizes: undefined,
    }
    expect(getMediaUrl(noUrlMedia)).toBeNull()
  })

  it('falls back to media.url when requested size URL is null', () => {
    const partialSizesMedia: Media = {
      ...mockMedia,
      sizes: {
        ...mockMedia.sizes,
        hero: {
          url: null,
          width: null,
          height: null,
          mimeType: null,
          filesize: null,
          filename: null,
        },
      },
    }
    expect(getMediaUrl(partialSizesMedia, 'hero')).toBe(
      'https://example.public.blob.vercel-storage.com/hero.jpg',
    )
  })
})

describe('getMediaAlt', () => {
  it('returns alt text for populated Media', () => {
    expect(getMediaAlt(mockMedia)).toBe('A beautiful modular home')
  })

  it('returns empty string for unpopulated relationship (number ID)', () => {
    expect(getMediaAlt(42)).toBe('')
  })

  it('returns empty string for null', () => {
    expect(getMediaAlt(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(getMediaAlt(undefined)).toBe('')
  })
})
