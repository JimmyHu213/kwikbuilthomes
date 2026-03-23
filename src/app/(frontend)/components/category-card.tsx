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
      className="block rounded-lg border-l-4 border-primary bg-secondary p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
      {category.description && (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      )}
      <p className="mt-3">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
      </p>
    </Link>
  )
}
