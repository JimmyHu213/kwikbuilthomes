import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { MobileNav } from './mobile-nav'

export async function Header() {
  let categories: { id: number; title: string; slug: string }[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      sort: 'displayOrder',
      limit: 20,
      depth: 0,
    })
    categories = result.docs.map((doc) => ({
      id: doc.id as number,
      title: doc.title as string,
      slug: doc.slug as string,
    }))
  } catch {
    // Graceful degradation: render header without category links if DB unavailable
  }

  return (
    <header className="border-b border-border bg-white">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-0.5 tracking-tight">
          <span className="text-xl font-bold text-foreground">KWIK</span>
          <span className="text-xl font-bold text-primary">BUILT</span>
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">HOMES</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {cat.title}
            </Link>
          ))}
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Request a Quote
          </Link>
        </div>

        <div className="md:hidden">
          <MobileNav categories={categories} />
        </div>
      </nav>
    </header>
  )
}
