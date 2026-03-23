import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import type { Product, Media } from '@/payload-types'

type ProductCardProps = {
  product: Pick<Product, 'id' | 'title' | 'slug' | 'excerpt' | 'priceRange' | 'heroImage'>
  categorySlug: string
}

export function ProductCard({ product }: ProductCardProps) {
  const heroImage =
    product.heroImage && typeof product.heroImage === 'object'
      ? (product.heroImage as Media)
      : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {heroImage ? (
        <div className="overflow-hidden">
          <img
            src={heroImage.sizes?.card?.url ?? heroImage.url ?? ''}
            alt={heroImage.alt ?? product.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-56 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No image available</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{product.title}</h3>
        {product.excerpt && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.excerpt}</p>
        )}
        <p className="mt-2 text-sm font-medium text-primary">
          {formatPrice(product.priceRange?.from, product.priceRange?.label)}
        </p>
      </div>
    </Link>
  )
}
