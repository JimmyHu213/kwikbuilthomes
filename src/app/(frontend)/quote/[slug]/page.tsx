import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { parseQuoteParams } from '@/lib/schemas/quote-schema'
import { extractOptionData } from '@/lib/configuration'
import { formatPrice } from '@/lib/format'
import { QuoteForm } from '../../components/quote-form'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const product = result.docs[0]
    if (!product) return { title: 'Product Not Found' }

    return {
      title: `Request a Quote - ${product.title}`,
      description: `Request a quote for ${product.title} modular home from Kwik Built Homes`,
    }
  } catch {
    return { title: 'Request a Quote' }
  }
}

export default async function QuotePage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  let product
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    product = result.docs[0]
  } catch {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> file, then
            restart the dev server.
          </p>
        </div>
      </main>
    )
  }

  if (!product) notFound()

  // Parse URL params to get selected options
  const selectedOptions = parseQuoteParams(resolvedSearchParams)

  // Extract option category data for display
  const categories = extractOptionData(product.optionCategories)

  // Resolve selected option names from categories + selections for display
  const selectedOptionSummary: { categoryName: string; optionNames: string[] }[] = []
  for (const [categoryId, optionIds] of Object.entries(selectedOptions)) {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) continue
    const optionNames = optionIds
      .map((id) => category.options.find((o) => o.id === id)?.name)
      .filter((name): name is string => name != null)
    if (optionNames.length > 0) {
      selectedOptionSummary.push({ categoryName: category.categoryName, optionNames })
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <Link
        href={`/products/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to {product.title}
      </Link>

      {/* Page title */}
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Request a Quote</h1>

      {/* Product summary card */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
        {product.priceRange?.from != null && (
          <p className="mt-1 text-sm text-gray-600">
            {formatPrice(product.priceRange.from, product.priceRange.label)}
          </p>
        )}

        {/* Selected options list */}
        {selectedOptionSummary.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Selected Options</h3>
            {selectedOptionSummary.map((item) => (
              <div key={item.categoryName} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-gray-600">{item.categoryName}:</span>
                <span className="text-gray-900">{item.optionNames.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote form */}
      <div className="mt-8">
        <QuoteForm
          productId={Number(product.id)}
          productSlug={slug}
          productTitle={product.title}
          selectedOptions={JSON.stringify(selectedOptions)}
          basePrice={product.priceRange?.from ?? null}
        />
      </div>
    </main>
  )
}
