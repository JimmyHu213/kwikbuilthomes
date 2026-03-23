import type { Media, Product } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'

export type OptionCardData = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  imageAlt: string
  priceModifier: number | null
}

export type OptionCategoryData = {
  id: string
  categoryName: string
  selectionType: 'single' | 'multiple'
  options: OptionCardData[]
}

/**
 * Transform CMS optionCategories into serializable OptionCategoryData[].
 *
 * Filters out categories with no options and maps each option to a clean
 * data shape suitable for client component props. Follows the
 * extractGallerySlides pattern from gallery.ts.
 */
export function extractOptionData(
  optionCategories: Product['optionCategories'],
): OptionCategoryData[] {
  if (!optionCategories) return []

  return optionCategories
    .filter((cat) => cat.options && cat.options.length > 0)
    .map((cat) => ({
      id: cat.id ?? cat.categoryName,
      categoryName: cat.categoryName,
      selectionType: cat.selectionType ?? 'single',
      options: (cat.options ?? []).map((opt) => ({
        id: opt.id ?? opt.name,
        name: opt.name,
        description: opt.description ?? null,
        imageUrl: getMediaUrl(opt.image),
        imageAlt:
          opt.image && typeof opt.image !== 'number'
            ? getMediaAlt(opt.image)
            : opt.name,
        priceModifier: opt.priceModifier ?? null,
      })),
    }))
}

/**
 * Sum the price modifiers for all selected options across all categories.
 *
 * Returns 0 when no selections exist. Ignores unknown category IDs
 * and treats null/undefined priceModifier values as 0.
 */
export function computeConfigTotal(
  selections: Record<string, string[]>,
  categories: OptionCategoryData[],
): number {
  let total = 0

  for (const [categoryId, optionIds] of Object.entries(selections)) {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) continue

    for (const optionId of optionIds) {
      const option = category.options.find((o) => o.id === optionId)
      if (option?.priceModifier) {
        total += option.priceModifier
      }
    }
  }

  return total
}

/**
 * Build a quote URL with selections serialized as search params.
 *
 * Format: /quote/{slug}?opt_{cat1}=id1,id2&opt_{cat2}=id3
 * Returns /quote/{slug} (no params) when selections is empty.
 */
export function buildQuoteUrl(
  slug: string,
  selections: Record<string, string[]>,
): string {
  const basePath = `/quote/${slug}`
  const entries = Object.entries(selections)

  if (entries.length === 0) return basePath

  const params = new URLSearchParams()
  for (const [categoryId, optionIds] of entries) {
    params.set(`opt_${categoryId}`, optionIds.join(','))
  }

  return `${basePath}?${params.toString()}`
}
