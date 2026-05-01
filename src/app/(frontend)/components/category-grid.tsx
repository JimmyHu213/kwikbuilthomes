import { getCachedCategories } from '@/lib/cached-data'
import { CategoryCard } from './category-card'
import { AnimateOnScroll } from './animate-on-scroll'

export async function CategoryGrid() {
  const categories = await getCachedCategories()

  if (categories.length === 0) return null

  return (
    <>
      <AnimateOnScroll className="mb-12">
        <div className="w-12 h-0.5 bg-primary mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Browse by Category</h2>
      </AnimateOnScroll>
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
    </>
  )
}
