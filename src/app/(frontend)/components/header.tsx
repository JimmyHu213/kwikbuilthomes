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
    <header className="border-b border-border bg-background">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Kwik Built Homes
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <MobileNav categories={categories} />
        </div>
      </nav>
    </header>
  )
}
