import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '../../components/product-card'
import type { Product } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const category = result.docs[0]
    if (!category) return { title: 'Category Not Found' }

    return {
      title: `${category.title} | Kwik Built Homes`,
      description:
        category.description || `Browse ${category.title} from Kwik Built Homes`,
    }
  } catch {
    return { title: 'Category | Kwik Built Homes' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  let categoryDoc: { id: number; title: string; slug: string; description?: string | null } | null =
    null
  let products: Product[] = []

  try {
    const payload = await getPayloadClient()

    // Find category by slug
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (categoryResult.docs.length === 0) {
      notFound()
    }

    const cat = categoryResult.docs[0]
    categoryDoc = {
      id: cat.id as number,
      title: cat.title as string,
      slug: cat.slug as string,
      description: cat.description as string | null | undefined,
    }

    // Find products in this category (depth: 1 to populate heroImage)
    const productResult = await payload.find({
      collection: 'products',
      where: {
        category: { equals: categoryDoc.id },
        status: { equals: 'active' },
      },
      depth: 1,
      sort: 'title',
      limit: 50,
    })

    products = productResult.docs as Product[]
  } catch (err) {
    // If notFound() was called, re-throw it (Next.js uses a special error for this)
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }

    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> file, then
            restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{categoryDoc!.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {categoryDoc!.title}
        </h1>
        {categoryDoc!.description && (
          <p className="mt-3 text-lg text-muted-foreground">{categoryDoc!.description}</p>
        )}
      </header>

      {products.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
          <p>No products available in this category yet.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categorySlug={slug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      limit: 50,
      depth: 0,
    })

    return result.docs.map((cat) => ({
      slug: cat.slug,
    }))
  } catch {
    return []
  }
}
