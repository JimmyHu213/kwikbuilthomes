import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

// Cache SiteContent for 5 minutes — rarely changes
export const getCachedSiteContent = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      return await payload.findGlobal({ slug: 'site-content' })
    } catch {
      return null
    }
  },
  ['site-content'],
  { revalidate: 300 },
)

// Cache SiteSettings for 5 minutes — rarely changes
export const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      return await payload.findGlobal({ slug: 'site-settings' })
    } catch {
      return null
    }
  },
  ['site-settings'],
  { revalidate: 300 },
)

export type CategoryWithProducts = {
  id: number
  title: string
  slug: string
  description?: string | null
  productCount: number
  heroImage?: Media | null
}

// Cache categories with product data for 1 minute — changes more often
export const getCachedCategories = unstable_cache(
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
  { revalidate: 60 },
)
