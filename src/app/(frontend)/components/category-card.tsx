import Link from 'next/link'
import Image from 'next/image'
import type { Category, Media } from '@/payload-types'

type CategoryCardProps = {
  category: Pick<Category, 'title' | 'slug' | 'description'>
  productCount: number
  heroImage?: Media | null
}

export function CategoryCard({ category, productCount, heroImage }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden border border-border hover:border-primary transition-colors duration-300 h-64"
    >
      {/* Background image or gradient */}
      {heroImage?.url ? (
        <Image
          src={heroImage.sizes?.card?.url ?? heroImage.url}
          alt={heroImage.alt ?? category.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D2D2D] to-[#4a4a4a]" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wide">{category.title}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{category.description}</p>
        )}
        <p className="mt-3">
          <span className="text-xs font-mono text-white/80 uppercase tracking-widest">
            {productCount} product{productCount !== 1 ? 's' : ''}
          </span>
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  )
}
