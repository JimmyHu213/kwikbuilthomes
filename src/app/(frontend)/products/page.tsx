import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { CategoryCard } from '../components/category-card'

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

    // Get product counts for each category
    categories = await Promise.all(
      result.docs.map(async (cat) => {
        const products = await payload.find({
          collection: 'products',
          where: {
            category: { equals: cat.id },
            status: { equals: 'active' },
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
  } catch (err) {
    console.error('Products page Payload error:', err)
    hasError = true
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Our Products</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse our complete range of Australian-engineered modular buildings
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

      {!hasError && categories.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={cat.productCount}
            />
          ))}
        </div>
      )}
    </div>
  )
}
