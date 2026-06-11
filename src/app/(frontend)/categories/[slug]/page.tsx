import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { ProductCard } from '../../components/product-card'
import { AnimateOnScroll } from '../../components/animate-on-scroll'
import type { Product } from '@/payload-types'

// ISR: re-render at most every 5 minutes so CMS edits appear without a redeploy
export const revalidate = 300

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
      title: category.title,
      description:
        category.description || `Browse ${category.title} from Kwik Built Homes`,
    }
  } catch {
    return { title: 'Category' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  let categoryDoc: { id: number; title: string; slug: string; description?: string | null } | null =
    null
  let products: Product[] = []

  try {
    const payload = await getPayloadClient()

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
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err
    }

    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1">.env.local</code> file, then
            restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Banner */}
      <section className="bg-gradient-to-br from-[#2D2D2D] to-[#3d3d3d] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{categoryDoc!.title}</span>
          </nav>
          <div className="w-12 h-0.5 bg-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {categoryDoc!.title}
          </h1>
          {categoryDoc!.description && (
            <p className="mt-3 text-lg text-white/70">{categoryDoc!.description}</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {products.length === 0 && (
          <div className="border border-border bg-muted/50 p-6 text-muted-foreground">
            <p>No products available in this category yet.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 100}>
                <ProductCard
                  product={product}
                  categorySlug={slug}
                />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
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
