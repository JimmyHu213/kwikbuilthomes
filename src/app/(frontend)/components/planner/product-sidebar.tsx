'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import type { ProductForPlanner, SceneTemplate } from '@/lib/planner/types'
import { usePlannerStore } from '@/lib/planner/store'
import { QuoteFromLayout } from './quote-from-layout'

type ProductSidebarProps = {
  products: ProductForPlanner[]
  preselectedSlug?: string
}

export function ProductSidebar({ products, preselectedSlug }: ProductSidebarProps) {
  const [search, setSearch] = useState('')
  const { placingProduct, setPlacingProduct } = usePlannerStore()
  const hasAutoSelected = useRef(false)

  async function handleProductClick(product: ProductForPlanner) {
    if (placingProduct?.productId === product.id) {
      setPlacingProduct(null)
      return
    }
    try {
      const res = await fetch(`/api/products/${product.slug}/template`)
      if (!res.ok) return
      const data = await res.json()
      setPlacingProduct({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        sceneTemplate: data.sceneTemplate as SceneTemplate,
      })
    } catch {
      console.error('Failed to load template for', product.slug)
    }
  }

  useEffect(() => {
    if (!preselectedSlug || hasAutoSelected.current) return
    const product = products.find((p) => p.slug === preselectedSlug)
    if (product) {
      hasAutoSelected.current = true
      handleProductClick(product)
    }
  }, [preselectedSlug, products])

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((product) => {
          const isActive = placingProduct?.productId === product.id
          const dims =
            product.dimensions?.length != null && product.dimensions?.width != null
              ? `${(product.dimensions.length / 1000).toFixed(1)} x ${(product.dimensions.width / 1000).toFixed(1)}m`
              : null
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductClick(product)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {product.templateThumbnailUrl && (
                <div className="relative aspect-[4/3] w-full mb-2 rounded overflow-hidden bg-muted">
                  <Image src={product.templateThumbnailUrl} alt={product.title} fill className="object-cover" sizes="200px" />
                </div>
              )}
              <p className="text-sm font-medium text-foreground">{product.title}</p>
              {dims && <p className="text-xs text-muted-foreground mt-0.5">{dims}</p>}
              {product.floorArea && <p className="text-xs text-muted-foreground">{product.floorArea} m²</p>}
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No products with 3D templates</p>
        )}
      </div>
      <div className="p-3 border-t border-border">
        <QuoteFromLayout />
      </div>
    </aside>
  )
}
