import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

function formatPrice(from?: number | null, label?: string | null) {
  if (label) return label
  if (from) return `from $${from.toLocaleString()} + GST`
  return 'Contact for pricing'
}

export default async function HomePage() {
  let products: Awaited<
    ReturnType<Awaited<ReturnType<typeof getPayloadClient>>['find']>
  >['docs'] = []
  let hasError = false

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      sort: 'title',
      limit: 50,
    })
    products = result.docs
  } catch (err) {
    console.error('Homepage Payload error:', err)
    hasError = true
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Kwik Built Homes
        </h1>
        <p className="mt-3 text-lg text-gray-600">
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

      {!hasError && products.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">
          <h2 className="font-semibold">No products available yet</h2>
          <p className="mt-1 text-sm">
            Create products in the{' '}
            <Link href="/admin" className="text-blue-600 underline">
              admin panel
            </Link>{' '}
            or run the seed script to get started.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Our Products</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block rounded-lg border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                {product.excerpt && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.excerpt}</p>
                )}
                <p className="mt-3 text-sm font-medium text-gray-900">
                  {formatPrice(product.priceRange?.from, product.priceRange?.label)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
