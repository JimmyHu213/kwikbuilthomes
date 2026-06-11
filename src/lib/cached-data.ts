import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

// NOTE: These tags pair with afterChange hooks (src/lib/revalidate.ts) so a CMS save
// clears the matching cache on demand — edits appear within seconds instead of waiting
// out the TTL. The route-level `export const revalidate = 300` (ISR) on each consuming
// page/layout is the fallback that re-renders if a hook is ever missed.
const CACHE_TTL_SECONDS = 300

// In development, skip the data cache entirely so content edits show on the next
// request — `revalidateTag` doesn't reliably clear unstable_cache under `next dev`.
// Production keeps the cache plus on-demand revalidation.
const isDev = process.env.NODE_ENV === 'development'
function cached<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  opts: { revalidate: number; tags: string[] },
): () => Promise<T> {
  return isDev ? fn : unstable_cache(fn, keyParts, opts)
}

// Cache SiteContent for 5 minutes — rarely changes
export const getCachedSiteContent = cached(
  async () => {
    try {
      const payload = await getPayloadClient()
      return await payload.findGlobal({ slug: 'site-content' })
    } catch {
      return null
    }
  },
  ['site-content'],
  { revalidate: CACHE_TTL_SECONDS, tags: ['site-content'] },
)

// Cache SiteSettings for 5 minutes — rarely changes
export const getCachedSiteSettings = cached(
  async () => {
    try {
      const payload = await getPayloadClient()
      return await payload.findGlobal({ slug: 'site-settings' })
    } catch {
      return null
    }
  },
  ['site-settings'],
  { revalidate: CACHE_TTL_SECONDS, tags: ['site-settings'] },
)

// Number of published project-gallery entries — used to hide the Projects nav
// link when there are none. Matches the listing query (drafts excluded by default).
export const getCachedProjectCount = cached(
  async (): Promise<number> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.count({ collection: 'project-gallery' })
      return result.totalDocs
    } catch {
      return 0
    }
  },
  ['project-gallery-count'],
  { revalidate: CACHE_TTL_SECONDS, tags: ['projects'] },
)

export type CategoryWithProducts = {
  id: number
  title: string
  slug: string
  description?: string | null
  productCount: number
  heroImage?: Media | null
}

// Cache categories with product data — aligned with route-level revalidate
export const getCachedCategories = cached(
  async (): Promise<CategoryWithProducts[]> => {
    try {
      const payload = await getPayloadClient()

      const [categoryResult, allProducts] = await Promise.all([
        payload.find({
          collection: 'categories',
          sort: 'displayOrder',
          limit: 20,
          depth: 0,
        }),
        payload.find({
          collection: 'products',
          where: { status: { equals: 'active' } },
          limit: 200,
          depth: 1,
          sort: '-createdAt',
        }),
      ])

      const productsByCategory = new Map<number, typeof allProducts.docs>()
      for (const product of allProducts.docs) {
        const catId = typeof product.category === 'object' ? product.category?.id : product.category
        if (catId != null) {
          const existing = productsByCategory.get(catId as number) ?? []
          existing.push(product)
          productsByCategory.set(catId as number, existing)
        }
      }

      return categoryResult.docs.map((cat) => {
        const catProducts = productsByCategory.get(cat.id as number) ?? []
        const firstProduct = catProducts[0]
        const heroImg = firstProduct?.heroImage && typeof firstProduct.heroImage === 'object'
          ? (firstProduct.heroImage as Media)
          : null

        return {
          id: cat.id as number,
          title: cat.title as string,
          slug: cat.slug as string,
          description: cat.description as string | null | undefined,
          productCount: catProducts.length,
          heroImage: heroImg,
        }
      })
    } catch {
      return []
    }
  },
  ['categories-with-products'],
  { revalidate: CACHE_TTL_SECONDS, tags: ['catalog'] },
)
