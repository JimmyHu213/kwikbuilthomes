import type { Media } from '@/payload-types'

type MediaSize = 'thumbnail' | 'card' | 'hero'

/**
 * Safely extract an image URL from a Payload Media relationship field.
 *
 * Handles all three states of a Payload relationship:
 * - Populated object (Media) -> returns the URL
 * - Unpopulated reference (number ID) -> returns null
 * - Empty (null/undefined) -> returns null
 *
 * When a size is specified, tries that size first and falls back to media.url.
 */
export function getMediaUrl(
  media: number | Media | null | undefined,
  size?: MediaSize,
): string | null {
  // Not populated (number ID, null, or undefined)
  if (!media || typeof media === 'number') {
    return null
  }

  // If a specific size is requested, try it first
  if (size && media.sizes?.[size]?.url) {
    return media.sizes[size]!.url!
  }

  // Fall back to the main URL
  return media.url ?? null
}

/**
 * Safely extract alt text from a Payload Media relationship field.
 *
 * Returns empty string for unpopulated or missing media (safe for img alt attributes).
 */
export function getMediaAlt(
  media: number | Media | null | undefined,
): string {
  if (!media || typeof media === 'number') {
    return ''
  }

  return media.alt
}
