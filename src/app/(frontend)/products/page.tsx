import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { CategoryCard } from '../components/category-card'
import { AnimateOnScroll } from '../components/animate-on-scroll'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Products | Kwik Built Homes',
  description:
    'Browse our range of modular homes, kit homes, container homes, tiny homes, sheds, and accessories.',
}

export default async function ProductsPage() {
  let categories: {
    id: number
    title: string
    slug: string
    description?: string | null
    productCount: number
    heroImage?: Media | null
  }[] = []
  let hasError = false

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      sort: 'displayOrder',
      limit: 20,
      depth: 0,
    })

    categories = await Promise.all(
      result.docs.map(async (cat) => {
        const products = await payload.find({
          collection: 'products',
          where: {
            category: { equals: cat.id },
          },
          limit: 1,
          depth: 1,
          sort: '-createdAt',
        })
        const firstProduct = products.docs[0]
        const heroImg = firstProduct?.heroImage && typeof firstProduct.heroImage === 'object'
          ? (firstProduct.heroImage as Media)
          : null

        return {
          id: cat.id as number,
          title: cat.title as string,
          slug: cat.slug as string,
          description: cat.description as string | null | undefined,
          productCount: products.totalDocs,
          heroImage: heroImg,
        }
      }),
    )
  } catch (err) {
    console.error('Products page Payload error:', err)
    hasError = true
  }

  return (
    <div>
      {/* Page Banner */}
      <section className="bg-gradient-to-br from-[#2D2D2D] to-[#3d3d3d] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-12 h-0.5 bg-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Our Products</h1>
          <p className="mt-3 text-lg text-white/70">
            Browse our complete range of Australian-engineered modular buildings
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {hasError && (
          <div className="border border-amber-200 bg-amber-50 p-6 text-amber-800">
            <h2 className="font-semibold">Content temporarily unavailable</h2>
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-1 text-sm">
                Add <code className="font-mono bg-amber-100 px-1">DATABASE_URL</code> and{' '}
                <code className="font-mono bg-amber-100 px-1">PAYLOAD_SECRET</code> to your{' '}
                <code className="font-mono bg-amber-100 px-1">.env.local</code> file, then
                restart the dev server.
              </p>
            )}
          </div>
        )}

        {!hasError && categories.length === 0 && (
          <div className="border border-border bg-muted/50 p-6 text-muted-foreground">
            <h2 className="font-semibold">No categories available yet</h2>
            <p className="mt-1 text-sm">
              Create categories in the{' '}
              <Link href="/admin" className="text-foreground underline">
                admin panel
              </Link>{' '}
              or run the seed script to get started.
            </p>
          </div>
        )}

        {categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <AnimateOnScroll key={cat.id} delay={i * 100}>
                <CategoryCard
                  category={cat}
                  productCount={cat.productCount}
                  heroImage={cat.heroImage}
                />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
