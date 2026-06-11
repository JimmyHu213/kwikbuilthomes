import Link from 'next/link'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { Metadata } from 'next'
import { getCachedCategories } from '@/lib/cached-data'
import { CategoryCard } from '../components/category-card'
import { AnimateOnScroll } from '../components/animate-on-scroll'

// ISR: re-render at most every 5 minutes so CMS edits appear without a redeploy
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse our range of modular homes, kit homes, container homes, tiny homes, sheds, and accessories.',
}

async function ProductCategoryGrid() {
  const categories = await getCachedCategories()

  if (categories.length === 0) {
    return (
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
    )
  }

  return (
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
  )
}

export default function ProductsPage() {
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
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        }>
          <ProductCategoryGrid />
        </Suspense>
      </div>
    </div>
  )
}
