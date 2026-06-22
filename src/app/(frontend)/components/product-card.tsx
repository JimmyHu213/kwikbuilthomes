import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import type { Product, Media } from '@/payload-types'

type ProductCardProps = {
  product: Pick<Product, 'id' | 'title' | 'slug' | 'excerpt' | 'priceRange' | 'heroImage' | 'bedrooms' | 'floorArea' | 'gallery'>
  categorySlug: string
}

export function ProductCard({ product }: ProductCardProps) {
  const heroImage =
    product.heroImage && typeof product.heroImage === 'object'
      ? (product.heroImage as Media)
      : null

  // Get second gallery image for hover effect
  const galleryImages = (product.gallery ?? [])
    .filter((item) => item.image && typeof item.image === 'object' && (item.image as Media).url)
  const secondImage = galleryImages.length > 0 ? (galleryImages[0].image as Media) : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-card overflow-hidden border border-border hover:border-primary transition-colors duration-300"
    >
      {/* Image area */}
      <div className="relative overflow-hidden">
        {heroImage ? (
          <div className="relative aspect-[4/3]">
            <Image
              src={heroImage.sizes?.card?.url ?? heroImage.url ?? ''}
              alt={heroImage.alt ?? product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 ${secondImage ? 'group-hover:opacity-0' : ''}`}
            />
            {secondImage && (
              <Image
                src={secondImage.sizes?.card?.url ?? secondImage.url ?? ''}
                alt={secondImage.alt ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image available</span>
          </div>
        )}

        {/* Spec badges */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 bg-gradient-to-t from-black/60 to-transparent">
          {product.bedrooms != null && (
            <span className="bg-black/70 text-white text-xs font-mono px-2 py-0.5">
              {product.bedrooms} BED
            </span>
          )}
          {product.floorArea != null && (
            <span className="bg-black/70 text-white text-xs font-mono px-2 py-0.5">
              {product.floorArea} m&sup2;
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-border">
        <h3 className="font-semibold text-foreground">{product.title}</h3>
        {product.excerpt && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.excerpt}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary font-mono">
            {formatPrice(product.priceRange?.from, product.priceRange?.label)}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
