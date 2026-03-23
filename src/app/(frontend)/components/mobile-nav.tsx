'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface MobileNavProps {
  categories: { id: number; title: string; slug: string }[]
}

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>
          <span className="text-lg font-bold text-foreground">KWIK</span>
          <span className="text-lg font-bold text-primary">BUILT</span>
          <span className="ml-1 text-xs font-medium text-muted-foreground">HOMES</span>
        </SheetTitle>
        <nav className="flex flex-col gap-1 mt-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-base py-3 text-foreground/70 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="text-base py-3 text-foreground/70 hover:text-primary transition-colors"
          >
            All Products
          </Link>
          <div className="h-px bg-border my-2" />
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="text-base py-3 text-foreground/70 hover:text-primary transition-colors"
            >
              {cat.title}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full mt-2"
          >
            Request a Quote
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
