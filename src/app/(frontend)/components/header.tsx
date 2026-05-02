import Link from 'next/link'
import { MobileNav } from './mobile-nav'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="border-b border-border bg-white">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-0.5 tracking-tight">
          <span className="text-xl font-bold text-foreground">KWIK</span>
          <span className="text-xl font-bold text-primary">BUILT</span>
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">HOMES</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="inline-flex items-center bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Request a Quote
          </Link>
        </div>

        <div className="md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  )
}
