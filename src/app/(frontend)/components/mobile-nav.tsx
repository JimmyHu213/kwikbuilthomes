'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-none size-8 hover:bg-muted transition-colors">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>
          <span className="text-lg font-bold text-foreground">KWIK</span>
          <span className="text-lg font-bold text-primary">BUILT</span>
          <span className="ml-1 text-xs font-medium text-muted-foreground">HOMES</span>
        </SheetTitle>
        <nav className="flex flex-col gap-1 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base py-3 text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors w-full mt-2"
          >
            Request a Quote
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
