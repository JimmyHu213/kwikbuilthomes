import type { Media, Product } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'

export type GallerySlide = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  category?: string
}

/**
 * Extract serializable slide data from a Payload Product gallery array.
 * Filters out unpopulated media references (number IDs) and items with no URL.
 */
export function extractGallerySlides(
  gallery: Product['gallery'] | null | undefined,
): GallerySlide[] {
  if (!gallery) return []

  return gallery
    .filter((item): item is typeof item & { image: Media } => {
      if (!item.image || typeof item.image === 'number') return false
      const url = getMediaUrl(item.image)
      return url !== null
    })
    .map((item) => ({
      src: getMediaUrl(item.image)!,
      alt: getMediaAlt(item.image),
      width: (item.image as Media).width ?? 1200,
      height: (item.image as Media).height ?? 800,
      caption: item.caption ?? undefined,
      category: item.category ?? undefined,
    }))
}
