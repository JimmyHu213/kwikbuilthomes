import Link from 'next/link'
import type { Category } from '@/payload-types'

type CategoryCardProps = {
  category: Pick<Category, 'title' | 'slug' | 'description'>
  productCount: number
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="block rounded-lg border border-border bg-card p-6 hover:border-foreground/20 hover:shadow-sm transition-all"
    >
      <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
      {category.description && (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        {productCount} product{productCount !== 1 ? 's' : ''}
      </p>
    </Link>
  )
}
