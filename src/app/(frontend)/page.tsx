import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { CategoryCard } from './components/category-card'
import { ProductCard } from './components/product-card'
import type { Product } from '@/payload-types'

export default async function HomePage() {
  let categories: {
    id: number
    title: string
    slug: string
    description?: string | null
    productCount: number
  }[] = []
  let featuredProducts: Product[] = []
  let hasError = false

  try {
    const payload = await getPayloadClient()

    // Fetch categories with product counts
    const categoryResult = await payload.find({
      collection: 'categories',
      sort: 'displayOrder',
      limit: 20,
      depth: 0,
    })

    categories = await Promise.all(
      categoryResult.docs.map(async (cat) => {
        const products = await payload.find({
          collection: 'products',
          where: {
            category: { equals: cat.id },
          },
          limit: 0,
          depth: 0,
        })
        return {
          id: cat.id as number,
          title: cat.title as string,
          slug: cat.slug as string,
          description: cat.description as string | null | undefined,
          productCount: products.totalDocs,
        }
      }),
    )

    // Fetch first 4 active products for featured section
    const productResult = await payload.find({
      collection: 'products',
      where: {},
      sort: 'title',
      limit: 4,
      depth: 1,
    })
    featuredProducts = productResult.docs as Product[]
  } catch (err) {
    console.error('Homepage Payload error:', err)
    hasError = true
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Kwik Built Homes
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Australian-engineered modular homes for developers, builders, and sub-distributors.
          NCC-compliant, factory-built, site-ready.
        </p>
      </header>

      {hasError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> file, then
            restart the dev server.
          </p>
        </div>
      )}

      {!hasError && categories.length === 0 && featuredProducts.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
          <h2 className="font-semibold">No products available yet</h2>
          <p className="mt-1 text-sm">
            Create products in the{' '}
            <Link href="/admin" className="text-foreground underline">
              admin panel
            </Link>{' '}
            or run the seed script to get started.
          </p>
        </div>
      )}

      {/* Categories section */}
      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Browse by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                productCount={cat.productCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products section */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Featured Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const categorySlug =
                product.category && typeof product.category === 'object'
                  ? product.category.slug
                  : ''
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categorySlug={categorySlug}
                />
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-medium text-foreground hover:underline"
            >
              View all products &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
